// Configuration ESLint (flat config) pour le site Astro + TypeScript.
// Lance via `pnpm lint`. Le formatage (espaces, quotes…) est délégué à
// Prettier ; ESLint ne s'occupe que de la qualité du code.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";

export default tseslint.config(
  {
    // Fichiers générés ou hors périmètre
    ignores: [
      "dist/",
      ".astro/",
      ".claude",
      "node_modules/",
      "src/content/blog/", // Markdown généré depuis Notion (gitignoré)
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // TypeScript (et `astro check`) gèrent déjà les références indéfinies, y
      // compris les types ambient d'Astro (ImageMetadata…). no-undef ne les
      // connaît pas → faux positifs. Désactivé comme recommandé en TS.
      "no-undef": "off",
      // Les ternaires/court-circuits à effet de bord sont volontaires ici
      // (ex. `delta < 0 ? goNext() : goPrev()`).
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },
);
