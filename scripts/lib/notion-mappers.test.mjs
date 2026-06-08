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
