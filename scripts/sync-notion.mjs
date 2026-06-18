import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  slugify,
  makeUniqueSlug,
  mapProperties,
  demoteHeadings,
  extractImageUrls,
  rewriteImageUrls,
  extFromUrl,
  stripFilenameAlts,
} from "./lib/notion-mappers.mjs";

const TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
// Cible de déploiement : "staging" inclut les articles en relecture,
// sinon (par défaut, "prod") on ne prend que les articles publiés.
const TARGET = process.env.SYNC_TARGET === "staging" ? "staging" : "prod";
const OUT_DIR = path.resolve("src/content/blog");
const IMG_DIR = path.join(OUT_DIR, "_images");

if (!TOKEN || !DATABASE_ID) {
  console.error(
    "✖ NOTION_TOKEN et NOTION_DATABASE_ID sont requis (voir .env).",
  );
  process.exit(1);
}

const notion = new Client({ auth: TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

function frontmatter(data) {
  // JSON.stringify produit un scalaire YAML double-quoted valide
  // (échappe guillemets, antislashs et retours ligne).
  const lines = [
    "---",
    `title: ${JSON.stringify(data.title)}`,
    `category: ${JSON.stringify(data.category)}`,
    `excerpt: ${JSON.stringify(data.excerpt)}`,
    `cover: ${JSON.stringify(data.cover)}`,
    `coverAlt: ${JSON.stringify(data.coverAlt ?? "")}`,
    `date: ${JSON.stringify(data.date)}`,
    `slug: ${JSON.stringify(data.slug)}`,
  ];
  // Image hero optionnelle : on n'écrit heroImage + heroAlt (paire indissociable)
  // que si un hero existe — sinon le schéma applique heroAlt: "" par défaut.
  if (data.heroImage) {
    lines.push(`heroImage: ${JSON.stringify(data.heroImage)}`);
    lines.push(`heroAlt: ${JSON.stringify(data.heroAlt ?? "")}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Téléchargement image échoué (${res.status}) : ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
}

async function fetchCategories() {
  const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
  const select = db.properties["Catégorie"]?.select;
  return (select?.options ?? []).map((o) => o.name);
}

// Filtre Notion selon la cible :
// - prod    : Statut = "Publié"
// - staging : Statut = "Publié" OU "En relecture"
function statusFilter() {
  const published = { property: "Statut", select: { equals: "Publié" } };
  if (TARGET === "staging") {
    return {
      or: [
        published,
        { property: "Statut", select: { equals: "En relecture" } },
      ],
    };
  }
  return published;
}

async function fetchPages() {
  const pages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: statusFilter(),
      sorts: [{ property: "Date", direction: "descending" }],
      start_cursor: cursor,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function main() {
  console.log(`▶ Synchronisation Notion (cible : ${TARGET})`);

  // 1. Nettoyer le dossier de sortie (reflète suppressions/dépublications)
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(IMG_DIR, { recursive: true });

  const pages = await fetchPages();
  const usedSlugs = new Set();
  let written = 0;

  for (const page of pages) {
    const data = mapProperties(page.properties);

    // 2. Cover obligatoire : un article sans couverture est ignoré (le site reste sain).
    if (!data.coverUrl) {
      console.warn(
        `⚠ Article ignoré (aucune image de couverture) : "${data.title}"`,
      );
      continue;
    }

    const base = data.slug ? slugify(data.slug) : slugify(data.title);
    const slug = makeUniqueSlug(base || "article", usedSlugs);
    usedSlugs.add(slug);

    const coverExt = extFromUrl(data.coverUrl);
    const coverFile = `${slug}-cover.${coverExt}`;
    await downloadImage(data.coverUrl, path.join(IMG_DIR, coverFile));
    const coverPath = `./_images/${coverFile}`;

    // 2b. Image hero (optionnelle) : fichier distinct suffixé -hero
    let heroPath = null;
    if (data.heroUrl) {
      const heroExt = extFromUrl(data.heroUrl);
      const heroFile = `${slug}-hero.${heroExt}`;
      await downloadImage(data.heroUrl, path.join(IMG_DIR, heroFile));
      heroPath = `./_images/${heroFile}`;
      if (!data.heroAlt) {
        console.warn(
          `⚠ Image hero sans texte alternatif dans "${data.title}" — renseigne « Alt hero » dans Notion pour l'accessibilité/SEO.`,
        );
      }
    }

    // 3. Corps Markdown
    const mdblocks = await n2m.pageToMarkdown(page.id);
    let body = n2m.toMarkdownString(mdblocks).parent ?? "";
    body = demoteHeadings(body);

    // 4. Images du corps : télécharger (sans doublon) + réécrire
    const urls = [...new Set(extractImageUrls(body))];
    const mapping = {};
    let i = 1;
    for (const url of urls) {
      const ext = extFromUrl(url);
      const file = `${slug}-${i}.${ext}`;
      await downloadImage(url, path.join(IMG_DIR, file));
      mapping[url] = `./_images/${file}`;
      i += 1;
    }
    body = rewriteImageUrls(body, mapping);

    // 4b. Alt « nom de fichier » (pas de légende Notion) → alt vide + avertissement
    const { markdown: cleanedBody, blanked } = stripFilenameAlts(body);
    body = cleanedBody;
    for (const altName of blanked) {
      console.warn(
        `⚠ Image sans légende dans "${data.title}" (alt vidé : ${altName}) — ajoute une légende dans Notion pour l'accessibilité/SEO.`,
      );
    }

    // 5. Écrire le .md
    const fm = frontmatter({
      ...data,
      cover: coverPath,
      heroImage: heroPath,
      slug,
    });
    await writeFile(path.join(OUT_DIR, `${slug}.md`), fm + body + "\n", "utf8");
    written += 1;
    console.log(`✓ ${slug}.md`);
  }

  // 6. Catégories depuis le Select Notion
  const categories = await fetchCategories();
  await writeFile(
    path.join(OUT_DIR, "_categories.json"),
    JSON.stringify(categories, null, 2),
    "utf8",
  );
  console.log(
    `✓ ${written} article(s) écrit(s), ${categories.length} catégorie(s).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
