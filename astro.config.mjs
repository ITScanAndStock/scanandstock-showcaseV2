// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import rehypeUnwrapImages from "rehype-unwrap-images";
import sitemap from "@astrojs/sitemap";

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
  // CSP : non géré par `security.csp` d'Astro (il hashe ses styles → rend
  // `'unsafe-inline'` inopérant, incompatible avec Tawk.to qui injecte des
  // styles inline en continu). Livré à la main via <meta> dans BaseLayout.astro
  // (approche pragmatique : 'unsafe-inline' toléré, allowlist d'origines tierces).
  integrations: [sitemap()],
  // Montserrat auto-hébergée via la Fonts API (RGPD : plus d'appel au CDN
  // Google Fonts) ; seules les graisses réellement utilisées sont incluses.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
    },
  ],
  markdown: {
    // Retire le <p> qui enveloppe les images seules dans le Markdown des articles
    rehypePlugins: [rehypeUnwrapImages],
    // Shiki applique des styles inline incompatibles avec la CSP (style-src
    // hashé → 'unsafe-inline' ignoré). Le blog n'a aucun bloc de code →
    // coloration désactivée (zéro impact visuel). Pour réactiver un jour avec
    // CSP, basculer sur Prism (classes CSS) + un thème.
    syntaxHighlight: false,
  },
});
