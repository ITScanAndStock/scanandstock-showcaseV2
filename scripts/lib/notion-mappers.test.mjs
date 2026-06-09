import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, makeUniqueSlug } from "./notion-mappers.mjs";

test("slugify met en minuscules et remplace les espaces", () => {
  assert.equal(slugify("Gestion Manuelle"), "gestion-manuelle");
});

test("slugify retire les accents", () => {
  assert.equal(slugify("Congrès été à Noël"), "congres-ete-a-noel");
});

test("slugify retire la ponctuation et les tirets en trop", () => {
  assert.equal(slugify("  Vers l'automatisation !  "), "vers-l-automatisation");
});

test("makeUniqueSlug renvoie le slug tel quel s'il est libre", () => {
  const used = new Set();
  assert.equal(makeUniqueSlug("article", used), "article");
});

test("makeUniqueSlug suffixe en cas de collision", () => {
  const used = new Set(["article"]);
  assert.equal(makeUniqueSlug("article", used), "article-2");
});

test("makeUniqueSlug incrémente jusqu'à trouver un libre", () => {
  const used = new Set(["article", "article-2"]);
  assert.equal(makeUniqueSlug("article", used), "article-3");
});

import { mapProperties } from "./notion-mappers.mjs";

const fullProps = {
  Titre: { title: [{ plain_text: "Gestion manuelle" }] },
  "Catégorie": { select: { name: "Gestion des stocks" } },
  Extrait: { rich_text: [{ plain_text: "Simplifiez la gestion." }] },
  Date: { date: { start: "2026-05-20" } },
  Slug: { rich_text: [{ plain_text: "gestion-manuelle" }] },
  Image: { files: [{ type: "file", file: { url: "https://notion.so/img.png?sig=abc" } }] },
  "Alt image": { rich_text: [{ plain_text: "Photo d'un cabinet dentaire" }] },
  "Image hero": { files: [{ type: "file", file: { url: "https://notion.so/hero.jpg?sig=xyz" } }] },
  "Alt hero": { rich_text: [{ plain_text: "Vue d'ensemble du cabinet" }] },
};

test("mapProperties extrait tous les champs", () => {
  assert.deepEqual(mapProperties(fullProps), {
    title: "Gestion manuelle",
    category: "Gestion des stocks",
    excerpt: "Simplifiez la gestion.",
    date: "2026-05-20",
    slug: "gestion-manuelle",
    coverUrl: "https://notion.so/img.png?sig=abc",
    coverAlt: "Photo d'un cabinet dentaire",
    heroUrl: "https://notion.so/hero.jpg?sig=xyz",
    heroAlt: "Vue d'ensemble du cabinet",
  });
});

test("mapProperties met coverAlt à vide si Alt image est absente", () => {
  const props = { ...fullProps };
  delete props["Alt image"];
  assert.equal(mapProperties(props).coverAlt, "");
});

test("mapProperties gère un slug absent (null)", () => {
  const props = { ...fullProps, Slug: { rich_text: [] } };
  assert.equal(mapProperties(props).slug, null);
});

test("mapProperties gère une image externe", () => {
  const props = {
    ...fullProps,
    Image: { files: [{ type: "external", external: { url: "https://cdn.com/x.jpg" } }] },
  };
  assert.equal(mapProperties(props).coverUrl, "https://cdn.com/x.jpg");
});

test("mapProperties gère une image absente (null)", () => {
  const props = { ...fullProps, Image: { files: [] } };
  assert.equal(mapProperties(props).coverUrl, null);
});

test("mapProperties lit Image hero → heroUrl", () => {
  assert.equal(mapProperties(fullProps).heroUrl, "https://notion.so/hero.jpg?sig=xyz");
});

test("mapProperties lit Alt hero → heroAlt", () => {
  assert.equal(mapProperties(fullProps).heroAlt, "Vue d'ensemble du cabinet");
});

test("mapProperties met heroAlt à vide si Alt hero est absente", () => {
  const props = { ...fullProps };
  delete props["Alt hero"];
  assert.equal(mapProperties(props).heroAlt, "");
});

test("mapProperties gère une image hero externe", () => {
  const props = {
    ...fullProps,
    "Image hero": { files: [{ type: "external", external: { url: "https://cdn.com/hero.jpg" } }] },
  };
  assert.equal(mapProperties(props).heroUrl, "https://cdn.com/hero.jpg");
});

test("mapProperties renvoie heroUrl null si Image hero est absente", () => {
  const props = { ...fullProps, "Image hero": { files: [] } };
  assert.equal(mapProperties(props).heroUrl, null);
});

test("mapProperties concatène un extrait multi-segments", () => {
  const props = {
    ...fullProps,
    Extrait: { rich_text: [{ plain_text: "Un " }, { plain_text: "extrait." }] },
  };
  assert.equal(mapProperties(props).excerpt, "Un extrait.");
});

test("mapProperties retire les espaces en début/fin d'extrait", () => {
  const props = {
    ...fullProps,
    Extrait: { rich_text: [{ plain_text: "  Texte avec espaces ! " }] },
  };
  assert.equal(mapProperties(props).excerpt, "Texte avec espaces !");
});

import { demoteHeadings } from "./notion-mappers.mjs";

test("demoteHeadings rétrograde chaque niveau d'un cran", () => {
  const input = "# Titre\n\nTexte\n\n## Sous-titre\n\n### Détail";
  const expected = "## Titre\n\nTexte\n\n### Sous-titre\n\n#### Détail";
  assert.equal(demoteHeadings(input), expected);
});

test("demoteHeadings plafonne à h6", () => {
  assert.equal(demoteHeadings("###### Profond"), "###### Profond");
});

test("demoteHeadings n'altère pas un # en milieu de ligne", () => {
  assert.equal(demoteHeadings("Voir la note #1 ici"), "Voir la note #1 ici");
});

import { extractImageUrls, rewriteImageUrls } from "./notion-mappers.mjs";

const mdImages = "Intro\n\n![photo](https://notion.so/a.png?sig=1)\n\n![](https://notion.so/b.jpg?sig=2)";

test("extractImageUrls renvoie toutes les URLs d'images", () => {
  assert.deepEqual(extractImageUrls(mdImages), [
    "https://notion.so/a.png?sig=1",
    "https://notion.so/b.jpg?sig=2",
  ]);
});

test("extractImageUrls renvoie un tableau vide sans image", () => {
  assert.deepEqual(extractImageUrls("Juste du texte"), []);
});

test("rewriteImageUrls remplace les URLs par les chemins locaux", () => {
  const mapping = {
    "https://notion.so/a.png?sig=1": "./_images/art-1.png",
    "https://notion.so/b.jpg?sig=2": "./_images/art-2.jpg",
  };
  const out = rewriteImageUrls(mdImages, mapping);
  assert.equal(
    out,
    "Intro\n\n![photo](./_images/art-1.png)\n\n![](./_images/art-2.jpg)",
  );
});

test("rewriteImageUrls laisse intactes les URLs non mappées", () => {
  const out = rewriteImageUrls(mdImages, {});
  assert.equal(out, mdImages);
});

import { extFromUrl } from "./notion-mappers.mjs";

test("extFromUrl lit l'extension malgré les query params", () => {
  assert.equal(extFromUrl("https://notion.so/path/a.PNG?sig=abc&exp=1"), "png");
});

test("extFromUrl gère jpeg", () => {
  assert.equal(extFromUrl("https://cdn.com/x.jpeg"), "jpeg");
});

test("extFromUrl retombe sur png par défaut", () => {
  assert.equal(extFromUrl("https://cdn.com/no-extension"), "png");
});

import { stripFilenameAlts } from "./notion-mappers.mjs";

test("stripFilenameAlts conserve une vraie légende", () => {
  const md = "![Le cabinet dentaire réorganisé](./_images/a-1.jpg)";
  const { markdown, blanked } = stripFilenameAlts(md);
  assert.equal(markdown, md);
  assert.deepEqual(blanked, []);
});

test("stripFilenameAlts vide un alt qui n'est qu'un nom de fichier", () => {
  const { markdown, blanked } = stripFilenameAlts("![image.png](./_images/a-1.jpg)");
  assert.equal(markdown, "![](./_images/a-1.jpg)");
  assert.deepEqual(blanked, ["image.png"]);
});

test("stripFilenameAlts vide un hash de fichier", () => {
  const md = "![07fc114e0edef2af166e13d353b8e3889ac7c7a5.jpg](./_images/a-1.jpg)";
  const { markdown, blanked } = stripFilenameAlts(md);
  assert.equal(markdown, "![](./_images/a-1.jpg)");
  assert.deepEqual(blanked, ["07fc114e0edef2af166e13d353b8e3889ac7c7a5.jpg"]);
});

test("stripFilenameAlts vide un nom de fichier lisible (.webp)", () => {
  const { markdown, blanked } = stripFilenameAlts(
    "![changement-cabinet-dentaire.webp](./_images/a-1.webp)",
  );
  assert.equal(markdown, "![](./_images/a-1.webp)");
  assert.deepEqual(blanked, ["changement-cabinet-dentaire.webp"]);
});

test("stripFilenameAlts laisse un alt déjà vide", () => {
  const md = "![](./_images/a-1.jpg)";
  const { markdown, blanked } = stripFilenameAlts(md);
  assert.equal(markdown, md);
  assert.deepEqual(blanked, []);
});

test("stripFilenameAlts ne confond pas une légende contenant un point", () => {
  const md = "![Version 2.0 du logiciel](./_images/a-1.jpg)";
  const { markdown, blanked } = stripFilenameAlts(md);
  assert.equal(markdown, md);
  assert.deepEqual(blanked, []);
});

test("stripFilenameAlts gère plusieurs images", () => {
  const md = "![Photo réelle](a.jpg)\n\n![image.png](b.jpg)";
  const { markdown, blanked } = stripFilenameAlts(md);
  assert.equal(markdown, "![Photo réelle](a.jpg)\n\n![](b.jpg)");
  assert.deepEqual(blanked, ["image.png"]);
});
