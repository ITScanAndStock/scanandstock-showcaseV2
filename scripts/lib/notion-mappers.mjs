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
