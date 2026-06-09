export function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les diacritiques
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum → tiret
    .replace(/^-+|-+$/g, ""); // trim des tirets
}

export function makeUniqueSlug(base, usedSet) {
  if (!usedSet.has(base)) return base;
  let i = 2;
  while (usedSet.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

function richText(prop) {
  return (prop?.rich_text ?? []).map((t) => t.plain_text).join("").trim();
}

function fileUrl(prop) {
  const file = prop?.files?.[0];
  if (!file) return null;
  return file.type === "external" ? file.external.url : file.file.url;
}

export function mapProperties(properties) {
  const slugText = richText(properties.Slug);
  return {
    title: properties.Titre?.title?.[0]?.plain_text ?? "",
    category: properties["Catégorie"]?.select?.name ?? "",
    excerpt: richText(properties.Extrait),
    date: properties.Date?.date?.start ?? "",
    slug: slugText === "" ? null : slugText,
    coverUrl: fileUrl(properties.Image),
    coverAlt: richText(properties["Alt image"]),
  };
}

export function demoteHeadings(markdown) {
  return markdown.replace(/^(#{1,5})(\s)/gm, "#$1$2");
}

const IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/g;

export function extractImageUrls(markdown) {
  const urls = [];
  for (const match of markdown.matchAll(IMAGE_RE)) {
    urls.push(match[1]);
  }
  return urls;
}

export function rewriteImageUrls(markdown, mapping) {
  return markdown.replace(IMAGE_RE, (full, url) => {
    const local = mapping[url];
    if (!local) return full;
    return full.replace(`(${url})`, `(${local})`);
  });
}

export function extFromUrl(url) {
  const pathname = new URL(url).pathname;
  const match = pathname.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "png";
}

const FILENAME_ALT_RE = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

// notion-to-md utilise la légende Notion comme alt, sinon le nom de fichier
// (souvent "image.png" ou un hash) — inutile et nuisible pour l'accessibilité.
// On vide ces alt « nom de fichier » (image décorative) et on les liste pour
// avertir l'auteur d'ajouter une légende dans Notion.
export function stripFilenameAlts(markdown) {
  const blanked = [];
  const out = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, url) => {
    const trimmed = alt.trim();
    if (trimmed !== "" && FILENAME_ALT_RE.test(trimmed)) {
      blanked.push(trimmed);
      return `![](${url})`;
    }
    return full;
  });
  return { markdown: out, blanked };
}
