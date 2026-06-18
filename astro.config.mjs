// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
  // Content Security Policy (Astro 6, stabilisé). Astro hashe automatiquement
  // ses propres scripts/styles (bundlés + inline) → ils restent autorisés.
  // On ne déclare ici que les tiers. ⚠️ Inactif en `dev` (Vite) : tester en
  // `build` + `preview`. La CSP par <meta> ne peut pas être en report-only.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // Images : self (Astro) + data: (inline) + https: (avatars Tawk, Calendly…)
        "img-src 'self' data: https:",
        "font-src 'self'",
        // Vidéos auto-hébergées sur S3
        "media-src 'self' https://scanandstock-media.s3.eu-west-3.amazonaws.com",
        // iframes : RDV Calendly + chat Tawk.to
        "frame-src https://calendly.com https://*.calendly.com https://*.tawk.to",
        // XHR/beacon/websocket : GA, Calendly, Tawk, envoi du formulaire
        "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://calendly.com https://*.calendly.com https://*.tawk.to wss://*.tawk.to https://formspree.io",
        // Le formulaire de contact poste vers Formspree
        "form-action 'self' https://formspree.io",
        "base-uri 'self'",
        "object-src 'none'",
        // Tawk.to peut instancier des web workers depuis un blob
        "worker-src 'self' blob:",
      ],
      scriptDirective: {
        // Remplace les sources par défaut de script-src ('self' à réintégrer ;
        // Astro y ajoute ses hashes). Tawk loader = self ; embed = *.tawk.to.
        resources: [
          "'self'",
          "https://assets.calendly.com",
          "https://www.googletagmanager.com",
          "https://*.tawk.to",
        ],
      },
      styleDirective: {
        // style-src : Astro y ajoute le hash de ses styles (dont l'@font-face
        // inline de la Fonts API). On autorise en plus le CSS externe de
        // Calendly et les styles que Tawk injecte. NB : impossible d'utiliser
        // 'unsafe-inline' ici — la présence d'un hash le ferait ignorer par les
        // navigateurs. Les attributs style="" runtime des widgets tiers sont
        // donc à surveiller (voir AUDIT.md § CSP).
        resources: ["'self'", "https://assets.calendly.com", "https://*.tawk.to"],
      },
    },
  },
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
  },
});