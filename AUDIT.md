# Audit du site scanandstock-showcaseV2

> Audit complet réalisé le 12 juin 2026 (Astro 6, site statique).
> Ce fichier suit l'avancement des corrections. Les éléments ✅ sont faits et
> vérifiés au build ; les ⬜ restent à traiter.

---

## ✅ Corrections déjà appliquées

| #   | Sujet                                                                                                                                                                                                                                               | Fichiers                                                                                                                                                                                                                          |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Carousel — script dupliqué** : `is:inline` désactivait la déduplication d'Astro → slides clonées en double et listeners doublés sur les pages à plusieurs carrousels. Retrait de `is:inline`.                                                     | `src/components/Carousel.astro`                                                                                                                                                                                                   |
| 2   | **Carousel — reduced-motion** : `startSmoothScroll()` ignorait `prefers-reduced-motion`. Garde ajoutée.                                                                                                                                             | `src/components/Carousel.astro`                                                                                                                                                                                                   |
| 3   | **FeaturesTabs — `controls="fasle"`** (typo → contrôles affichés) supprimé, `autoplay` retiré.                                                                                                                                                      | `src/components/FeaturesTabs.astro`                                                                                                                                                                                               |
| 4   | **RGPD** : GA + Tawk.to chargés sans consentement, Google Fonts via CDN Google. → Bannière de consentement (CNIL : refuser = accepter, choix 6 mois) + Montserrat auto-hébergée via la Fonts API Astro 6 (graisses 300-700, plus d'appel à Google). | `src/components/CookieConsent.astro` (nouveau), `src/components/ThirdPartyScripts.astro`, `src/components/Footer.astro` (lien « Gérer les cookies »), `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/styles/global.css` |
| 5   | **Vidéos témoignages (95 Mo)** déplacées sur S3, retirées du repo (`git rm` en attente de commit).                                                                                                                                                  | `src/pages/index.astro`                                                                                                                                                                                                           |
| 6   | **FeaturesTabs — 5 vidéos en `preload="auto"`** téléchargées au chargement. → `data-src` + `preload="none"` + IntersectionObserver (charge la 1re vidéo à la visibilité, les autres au clic).                                                       | `src/components/FeaturesTabs.astro`                                                                                                                                                                                               |
| 7   | **Démo GitHub Pages indexable** (contenu dupliqué avec la prod). → `noindex` ajouté quand `GITHUB_PAGES === "true"`.                                                                                                                                | `src/layouts/BaseLayout.astro`                                                                                                                                                                                                    |
| 8   | **Page 404 absente** → page de marque créée (servie auto par GitHub Pages).                                                                                                                                                                         | `src/pages/404.astro` (nouveau)                                                                                                                                                                                                   |
| —   | **JSON-LD non échappé** (injection possible via titre/extrait Notion contenant `</script>`). → `.replace(/</g, "\\u003c")`.                                                                                                                         | `src/pages/blogs/[slug].astro`                                                                                                                                                                                                    |
| —   | **og:image = SVG** (non supporté par les réseaux sociaux). → Bannière PNG 1200×630 générée (fond dégradé + logo blanc).                                                                                                                             | `scripts/generate-og-banner.mjs` (nouveau), `src/assets/og-banner.png` (nouveau), `src/layouts/BaseLayout.astro`                                                                                                                  |

> ⚠️ **Non commité** : les `git rm` des 3 MP4 + les nouveaux fichiers (CookieConsent, 404, og-banner.png, generate-og-banner.mjs) sont en attente. Les MP4 restent dans l'historique git (~95 Mo) — `git filter-repo --path src/assets/video --invert-paths` pour purger si besoin (destructif).
>
> ✅ **Paragraphe cookies ajouté** (18 juin 2026) : section « Cookies » dans `src/pages/legal-notices.astro` (finalités GA/Tawk, consentement préalable, choix conservé 6 mois, retrait via « Gérer les cookies » du footer) — cible du lien « En savoir plus » de la bannière.

---

## Accessibilité

### ✅ Traité (session du 15 juin 2026, vérifié au build)

- **Alts d'images décoratives** → `alt=""` : 6 GIF de `about.astro`, 5 illustrations du hero `index.astro` (stats/order/stock/warning/compare), 3 icônes de `InfoUsers.astro`.
- **Menu burger accessible** (`NavigationBar.astro`) : pattern checkbox+label remplacé par `<button aria-expanded aria-controls>` + script bundlé (ouverture/fermeture, `Escape`, fermeture au clic lien/overlay, gestion du focus + piège à focus dans le tiroir ouvert, `overflow:hidden` sur `body`).
- **HTML valide** (`about.astro`) : les `<div>` séparateurs et formes déco enfants directs de `<ul>` → `<li role="presentation">` (4 séparateurs + 2 formes, rendu flex identique). Note : `index.astro` n'avait en fait pas ce problème (les déco y sont dans des `<div>`/`<figure>`, pas des `<ul>`).
- **Hiérarchie de titres** : `index.astro` — le titre au-dessus de FeaturesTabs passe de `h3` à `h2` et reçoit un libellé distinct (« Découvrez Scan & Stock en vidéo ») au lieu de dupliquer le `h2` suivant. `CardCarousel.astro` : `<h2>` de carte → `<h3>` (+ sélecteur CSS).
- **ARIA tabs** (`FeaturesTabs.astro`) : `aria-label` sur la tablist, `id`/`aria-controls`/roving `tabindex` sur les onglets, `role="tabpanel"`/`id`/`aria-labelledby` sur les vidéos, navigation clavier `ArrowLeft`/`ArrowRight`/`Home`/`End` (activation auto, le focus ne saute pas pendant l'auto-avance).
- **Carrousel** (`Carousel.astro`) : `aria-live="polite"` retiré du track (défilement continu = annonces permanentes).
- **iframe YouTube** (`about.astro`) : `title` ajouté, `loading="lazy"`, `allow`/`allowfullscreen`, `autoplay=1` retiré.
- **Vidéos témoignages** (`index.astro`) — poster figé au tap (son OK) sur mobile. Investigation 3 agents (attributs/JS, encodage MP4, CSS). **Cause racine : `backdrop-filter: blur()` sur `.testimonial-caption::before`** superposé à la vidéo → couche de compositing GPU non repeinte pendant la lecture (présent uniquement sur les témoignages ; les FeaturesTabs, même codec HEVC, fonctionnent → codec/faststart disculpés). **Fix : `backdrop-filter` retiré** (dégradé sombre conservé pour la lisibilité). Améliorations conservées par ailleurs : `playsinline` + contrôles natifs sur tactile + suppression du `touchend`/`preventDefault`. ⚠️ À valider sur iPhone réel (non reproductible hors device). Sujet distinct hors périmètre : HEVC non lu par Chrome/Firefox **desktop**.
- **Téléphones** : `tel:+33784078048` (format international) dans `ContactForm.astro` et `Footer.astro`.
- **Viewport** (`BaseLayout.astro`) : `width=device-width, initial-scale=1`.

### ✅ Liens réseaux sociaux (corrigé le 18 juin 2026)

- Les 4 liens du `Footer.astro` pointent désormais vers les vraies URLs (Facebook `/scanandstock`, Instagram, LinkedIn `/company/scanandstock/`, YouTube `@scanandstock`). Adresse postale → lien Google Maps, liens externes en `target="_blank"`.

### ✅ Photo « Nicholas Larcin » (corrigé le 18 juin 2026)

- Vraie photo fournie : `src/assets/photos/nicholas_larcin.png` (fichier distinct d'Arthur), utilisée en `about.astro` avec l'alt « Nicholas Larcin, Marketing de Scan & Stock ».

### ⬜ En attente de données / décision produit

- **Vidéos témoignages** (`index.astro`) : lecture au survol **avec son**, sans contrôles natifs ni sous-titres (WCAG 1.2.2 / 1.4.2). Décision produit : ajouter des contrôles (`controls`) et/ou des sous-titres (`<track kind="captions">`) ? Ne pas modifier sans validation (comportement hover/tap longuement travaillé).

### À vérifier manuellement (interaction, non testable au build)

- Au clavier : Tab jusqu'au burger → Entrée ouvre, focus entre dans le tiroir, Tab boucle dedans, Échap ferme et rend le focus au burger.
- Onglets FeaturesTabs : flèches gauche/droite changent d'onglet et de vidéo.

---

## Sécurité

### ✅ Font Awesome supprimé (session du 17 juin 2026, vérifié au build)

- Kit `kit.fontawesome.com/db30f5a5c0.js` retiré de `BaseLayout.astro` → plus de script tiers bloquant, sans SRI, exécutant du JS arbitraire, ni de dépendance externe.
- Remplacé par un composant `src/components/ui/Icon.astro` (SVG inline, `1em`/`currentColor`, tracés stroke style Lucide) pour les 5 icônes utilisées (`chevron-down/left/right`, `bars`, `x`) — 8 instances dans `NavigationBar`, `Carousel`, `blogs.astro`, `about.astro`. Rotation du chevron FAQ reportée (`.help summary i` → `:global(svg)`). Icônes rendues vérifiées visuellement. (Effet secondaire : supprime aussi un des deux blocages CSS du `<head>`.)

### ✅ CSP configurée (18 juin 2026, build OK — ⚠️ test runtime tiers à faire)

- `security.csp` activé dans `astro.config.mjs` → `<meta http-equiv="content-security-policy">` généré sur les 10 pages. `script-src` **strict** (hashes Astro + hôtes `assets.calendly.com`, `www.googletagmanager.com`, `*.tawk.to`, **sans** `'unsafe-inline'`) = protection anti-XSS réelle. Autres directives : `default-src 'self'`, `img-src 'self' data: https:`, `font-src 'self'`, `media-src` S3, `frame-src` Calendly/Tawk, `connect-src` GA/Calendly/Tawk/Formspree, `form-action` Formspree, `object-src 'none'`, `worker-src 'self' blob:`.
- **Refactors rendus nécessaires par la CSP** (Astro ne peut pas hasher l'inline) :
  - 4 `onclick="Calendly.initPopupWidget(...)"` (ReserveButton, NavigationBar ×2, ContactForm) → attribut `data-calendly-url` + 1 script délégué bundlé dans `ThirdPartyScripts.astro` (hashé → autorisé).
  - Honeypot `ContactForm` : `style=""` inline → classe `.honeypot` dans le `<style>` scopé.
  - **Shiki désactivé** (`markdown.syntaxHighlight: false`) : la coloration syntaxique applique des styles inline incompatibles CSP. Le blog n'a aucun bloc de code → zéro impact. Pour réactiver avec CSP : basculer sur Prism (classes CSS) + thème.
- ⚠️ **Risque résiduel à valider en `pnpm preview`** (la CSP est inactive en `dev`, et un `<meta>` ne peut pas être en report-only) : les attributs `style=""` que **Tawk** (et peut-être Calendly) posent au runtime sont **bloqués** car `style-src` contient un hash (l'`@font-face` inline de la Fonts API) → `'unsafe-inline'` est ignoré. **Si la bulle Tawk / le popup Calendly s'affichent mal** : externaliser le CSS de la police (abandonner l'inline du composant `<Font>`) pour supprimer le hash de `style-src` et activer `'unsafe-inline'` côté styles. `script-src` resterait inchangé.
- À tester : popup Calendly (3 boutons RDV), chat Tawk après consentement cookies, chargement GA, envoi du formulaire Formspree, vidéos S3, police Montserrat. Vérifier la **console** (0 violation `Refused to…`).

### ✅ tawkto.js corrigé (17 juin 2026)

- `crossorigin="*"` (invalide) → `"anonymous"`. `Tawk_API`/`Tawk_LoadStart` passés sur `window` (étaient `var` locaux à l'IIFE) → l'embed et toute config ultérieure (`Tawk_API.visitor`, `onLoad`…) partagent le même objet global. IIFE interne redondante retirée.

### ✅ Honeypot Formspree ajouté (17 juin 2026)

- `src/components/ContactForm.astro` : champ masqué `_gotcha` (hors flux visuel + `tabindex="-1"` + `aria-hidden`) → Formspree rejette les soumissions où il est rempli (bots). Vérifié au build. reCAPTCHA possible en complément si le spam persiste.

---

## Performance

### ✅ Traité (session du 17 juin 2026, vérifié au build)

- **Images responsive** : activation globale `image: { layout: "constrained", ... }` **non retenue** (redondante — les carrousels avaient déjà `widths`/`sizes`). Seule la cover de `BlogCard` manquait de variantes → ajout ciblé `widths={[363, 726]}` + `sizes="363px"` (sûr : affichage piloté par CSS `aspect-ratio`/`object-fit`, sert du 2× retina).
- **Placement images carrousel cards corrigé** : `CardCarousel.astro` avait `<Image width={800} height={220}>` → forçait un crop 3,64:1 dans le fichier généré (sources ~1,3-1,6:1, bandes haut/bas perdues). `height={220}` retiré + `quality={70}` → Astro garde le ratio source (vérifié : `800×601`), le recadrage se fait à l'affichage via le CSS (`.img { height: 220px; object-fit: cover }`).
- **`ImageCarousel.astro` — deux tailles restaurées** : `width={800}` (+`widths`/`sizes`) forçait toutes les images au même ratio 800×370. Or les sources ont deux ratios (546×595 portrait, 884×595 paysage). Retour à `height={370}` seul (+`quality={70}`) → Astro déduit la largeur par source : portrait `340×370`, paysage `550×370` (vérifié au build). Pas de `widths`/`sizes` : sources ≤884px ≈ taille d'affichage, srcset inutile.
- **favicon 57 Ko → 8,7 Ko** : `public/favicon.ico` reconstruit en multi-tailles 16/32/48 (PNG embarqué, même pictogramme scan) + `public/favicon-32.png` (2,7 Ko) ajouté pour la netteté HiDPI. Liens `<link rel="icon" sizes="any">` + `type="image/png" 32x32` dans `BaseLayout.astro`.

### ✅ Déjà résolu lors de sessions précédentes (audit obsolète)

- **GIF animés (about)** : déjà convertis en `<video>` MP4 + poster (`public/animations/*.mp4`). Plus aucun GIF dans `about.astro`.
- **Posters témoignages** : déjà passés par le pipeline (`getImage()` → WebP 360×510 dans `index.astro`), plus servis en PNG brut.

### `priority` sur le hero — impact négligeable ici

- Le hero de `index.astro` n'a **pas** d'image LCP lourde : le LCP est le `<h1>` sur dégradé, les SVG autour (`order`/`stock`/`warning`/`compare`) et `stats.webp` sont décoratifs (`aria-hidden`). Ajouter `priority` n'apporterait quasiment rien. Item considéré comme non pertinent.

### ✅ CSS bloquant résolu (18 juin 2026, build OK)

- Font Awesome : déjà supprimé (voir § Sécurité).
- Calendly `widget.css` : chargé en `media="print"` (non bloquant) puis repassé en `media="all"` par un script bundlé hashé (`BaseLayout.astro`). Swap en JS et non en `onload=""` inline → compatible avec la CSP. La feuille n'étant utile qu'à l'ouverture du popup (au clic), elle n'est jamais critique pour le rendu initial.

---

## 📱 iPhone / iOS Safari (audit du 17 juin 2026)

> Symptômes signalés : « le site ne charge pas bien du tout » + « le carousel
> client ne fonctionne pas du tout », constatés sur la démo `itscanandstock.github.io`
> (capture iPhone Safari : photos clients qui se chevauchent + barre « lecteur
> média » iOS flottante en bas). Investigation par lecture du code (la reproduction
> fine du compositing GPU iOS exige un device réel — voir tests minimaux ci-dessous).

### ✅ C1 — Overlay « lecteur média » iOS _(corrigé le 18 juin 2026)_

- **Cause** : `VideoPresentation.astro` chargeait un iframe YouTube `embed/x3FlUQBuKHY?autoplay=1&...`. YouTube déclarait une `MediaSession` (titre + artwork) → iOS affichait ses contrôles système par-dessus la page (= la capture).
- **Fix** : iframe YouTube → `<video>` natif auto-hébergé S3. Vidéo source HEVC 1080p/26,6 Mo ré-encodée en **H.264 720p faststart sans audio → 2,4 Mo** (`presentation_scanandstock.mp4`). Suppression : ~1 Mo de JS tiers + traceur YouTube + overlay iOS (vidéo `muted` → pas de MediaSession). Poster WebP via pipeline Astro (`src/assets/video/poster/presentation.png`). Lazy-load + autoplay desktop uniquement (play/pause selon visibilité), contrôles natifs sans autoplay sur tactile/reduced-motion.
- ✅ **Vidéo uploadée sur S3** (18 juin 2026) : `https://scanandstock-media.s3.eu-west-3.amazonaws.com/videos/presentation_scanandstock.mp4` répond `HTTP 200` (`video/mp4`).

### ✅ C2 — Carrousel client : photos qui se chevauchent _(corrigé le 18 juin 2026 — validé Safari macOS + iPhone)_

- **Cause racine confirmée** : **bug flexbox WebKit** (Safari iOS _et_ macOS), PAS le compositing GPU initialement soupçonné. Une capture Safari macOS a reproduit le chevauchement → l'hypothèse `mask-image`/GPU est écartée. Sur WebKit, `.group` (flex item qui est lui-même un conteneur `justify-content: center`) se comprimait sous la taille de son contenu ; les cartes `flex: 0 0 110px` non-rétrécissables débordaient alors vers le centre et se chevauchaient. Chrome respecte `min-width: auto` (= min-content) et ne comprime pas → d'où « OK sur Chrome, cassé sur Safari ».
- **Fix (`ClientsCarousel.astro`, `.group`)** : `flex-shrink: 0` + `min-width: max-content` (le groupe ne se comprime jamais sous son contenu) + `justify-content: flex-start` (neutralise le déclencheur du débordement vers le centre).
- **Nettoyages liés faits au passage** (sans rapport avec le bug, mais sains pour WebKit) : `mask-image` → dégradés de bord `::before`/`::after` en `#f0f6fe` (fond MainBox) ; `translate: -100%` → `transform: translateX(-100%)` ; `overflow-x: auto` → `overflow: hidden`.
- **Validé** : Safari macOS **et iPhone** (plus de chevauchement, défilement propre).

### ✅ C3a — Garde tactile FeaturesTabs _(corrigé le 18 juin 2026)_

- **Contexte** : au scroll, deux lectures démarraient en parallèle (1re vidéo FeaturesTabs + iframe YouTube). Le volet YouTube est déjà réglé par **C1** (plus d'autoplay sur tactile) → restait la 1re vidéo FeaturesTabs.
- **Fix** (`FeaturesTabs.astro`) : garde `(hover: none), (pointer: coarse)` sur l'IntersectionObserver → pas d'autoplay sur tactile, lecture au tap d'un onglet (geste utilisateur, OK iOS). + fond dégradé de marque sur `.video-frame` pour que l'état au repos (sans poster) ne soit pas une zone vide ; la vidéo le recouvre une fois lue.
- ⬜ **C3b — posters par vidéo** : non décidé. Les 5 `<video>` n'ont pas d'image d'attente individuelle (le dégradé de marque sert de placeholder commun). À faire seulement si on veut un aperçu spécifique par onglet (extraction d'une frame de chaque MP4 S3).

### ✅ C4 — `min-height: 100vh` → `100dvh` _(corrigé le 18 juin 2026)_

- `global.css` : `min-height: 100vh` conservé en fallback, suivi de `min-height: 100dvh` (sur iOS la barre d'outils dynamique fausse `100vh`). Les navigateurs sans support `dvh` ignorent la 2e déclaration.

---

## ⬜ Qualité de code & process

### CLAUDE.md désynchronisé (dangereux pour les futures sessions IA)

- FeaturesTabs : maintenant réellement lazy (le doc le disait déjà, c'est désormais vrai).
- Propriété Notion lue = `Extrait`, pas `Résumé` (`scripts/lib/notion-mappers.mjs:32`). Corriger le CLAUDE.md.
- `tawkto.js` est dans `public/js/`, pas `src/js/`.
- `body max-width` réel = **1580px** (`src/styles/global.css`), pas 1240px.
- Propriétés Notion `Image hero` / `Alt hero` non documentées.
- Ajouter la doc du composant `CookieConsent` et de l'asset `og-banner.png` (le script `generate-og-banner.mjs` a été supprimé après génération — la bannière est versionnée telle quelle).

### CI incomplète

- `.github/workflows/deploy-pages.yml` ne lance ni `pnpm test` ni `astro check` avant déploiement. Un test mapper cassé partirait en prod.
- `@astrojs/check` n'est pas installé → l'ajouter pour `astro check`.
- Ajouter `"packageManager": "pnpm@10..."` dans `package.json` (corepack).

### ✅ Duplication CSS réduite (18 juin 2026)

- Les carrés blancs flottants du hero (`.deco-white*` + `@keyframes deco-roam-a/b/c`), strictement identiques entre `index.astro` et `about.astro`, sont extraits dans `src/styles/deco.css` (importé par les deux pages). C'était le gros de la duplication (surtout les keyframes). Au passage, `reduced-motion` stoppe désormais aussi l'animation sur l'accueil (cohérent avec about).
- Les remplissages colorés `.deco-blue`/`.deco-teal` restent **par composant** volontairement : leurs angles de dégradé diffèrent (110° dans index/about/ContactForm, **116°** dans ImgPresentation/InfoFeatures) et leur dimensionnement est spécifique → un style partagé créerait des conflits de spécificité.

### ✅ Couleurs en dur centralisées (18 juin 2026)

- Palette de marque définie en custom properties dans `:root` de `global.css` (`--color-primary`, `--color-primary-dark`, `--color-secondary`, `--color-tertiary`, `--color-quaternary`, `--color-violet`, `--color-text`, `--color-bg-light`, `--color-bg-soft`). Les ~110 occurrences des 9 hexes de palette ont été remplacées par `var(--…)` dans tous les `.astro`/`.css` (valeurs identiques → aucun changement visuel). Restent en dur quelques teintes ponctuelles rares (ex. `#51646d`) et les blancs/noirs génériques.

### ✅ ESLint + Prettier ajoutés (18 juin 2026)

- `eslint.config.js` (flat config : `@eslint/js` + `typescript-eslint` + `eslint-plugin-astro`), `.prettierrc.json` (+ `prettier-plugin-astro`), `.prettierignore`. Scripts `lint`/`format`/`format:check`. `"packageManager": "pnpm@10.34.3"` ajouté.
- ESLint passe **0 erreur** ; corrections au passage : import mort `HeroBox` retiré de `InfoUsers.astro`, `no-undef` désactivé (géré par TS), `no-unused-expressions` configuré pour autoriser les ternaires à effet de bord. `prettier --write` appliqué à tout le repo (39 fichiers, indentation homogénéisée).

### Divers

- `src/pages/blogs.astro:19` : `readFile` + `JSON.parse` → remplaçable par `import categories from "...json"` (résolu au build, typé).
- `src/content.config.ts` : `date: z.string()` → `z.coerce.date()` (validation réelle + tri par Date au lieu de `localeCompare`).

---

## Ordre suggéré pour la suite

1. **Petits correctifs** (rapides, fort impact visible) : liens sociaux footer, tél international, photo Nicholas Larcin, viewport.
2. **Accessibilité** : alts, burger clavier, HTML invalide, hiérarchie titres.
3. **Sécurité** : CSP, remplacement Font Awesome par SVG inline, honeypot Formspree.
4. **Performance** : images responsive + `priority` hero, GIF → WebP.
5. **Qualité** : resync CLAUDE.md, CI (test + check), dédup CSS, variables de couleur.
