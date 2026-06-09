// @ts-check
import { defineConfig } from 'astro/config';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import sitemap from '@astrojs/sitemap';

// Déploiement démo sur GitHub Pages : le site est servi sous un sous-dossier
// (https://itscanandstock.github.io/scanandstock-showcaseV2/), il faut donc un `base`.
// Activé uniquement via GITHUB_PAGES=true (CI) → la prod scanandstock.fr reste inchangée.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

// https://astro.build/config
export default defineConfig({
  site: isGitHubPages
    ? "https://itscanandstock.github.io"
    : "https://www.scanandstock.fr",
  base: isGitHubPages ? "/scanandstock-showcaseV2/" : undefined,
  integrations: [sitemap()],
  markdown: {
    // Retire le <p> qui enveloppe les images seules dans le Markdown des articles
    rehypePlugins: [rehypeUnwrapImages],
  },
});