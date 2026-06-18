# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
pnpm dev          # Synchronise Notion (predev) puis démarre le serveur de dev sur localhost:4321
pnpm build        # Synchronise Notion (prebuild) puis compile le site statique dans ./dist/
pnpm preview      # Prévisualise le build local
pnpm sync:notion  # Lance manuellement la synchronisation des articles Notion
pnpm test         # Tests unitaires des mappers Notion (node --test)
```

> Le serveur de dev tourne sur le port **4321**. **Node `>=24`** requis (figé par `.nvmrc` + `engines`).
> `nvm use 24` avant toute commande. Les hooks `predev`/`prebuild` lancent la synchro Notion
> via `node --env-file-if-exists=.env` (ne plante pas si `.env` absent).

## Architecture

Site vitrine statique **Astro 6** pour Scan&Stock (logiciel de gestion de stocks dentaires), déployé sur
`https://www.scanandstock.fr`. Le blog est alimenté **au build** depuis une base **Notion**
(voir « Intégration Notion » ci-dessous).

### Couches de l'architecture

```
src/layouts/BaseLayout.astro   ← Layout unique : meta SEO (description, OG, Twitter), canonical, Montserrat, Calendly, Font Awesome
src/pages/                     ← Routes fichier (index, about, blogs, blogs/[slug])
src/components/ui/             ← Primitives génériques (GradientTitle, Hero-box, Main-box)
src/components/                ← Composants métier (voir liste complète ci-dessous)
src/content/blog/              ← Markdown + images GÉNÉRÉS depuis Notion (gitignoré, ne pas éditer à la main)
src/content.config.ts          ← Collection `blog` (loader glob + schéma Zod)
src/styles/                    ← reset.css + global.css (body max-width: 1240px, Montserrat)
src/assets/                    ← Images traitées par Astro (<Image /> avec optimisation WebP via sharp)
src/js/                        ← Scripts IIFE tiers (ex. tawkto.js)
scripts/                       ← sync-notion.mjs (synchro build-time) + lib/ (mappers purs testés)
public/                        ← Fichiers statiques non transformés (robots.txt, favicon)
```

### Intégration Notion (blog)

Les articles du blog ne sont **pas** écrits dans le repo : ils sont tirés d'une base Notion à chaque
`dev`/`build` par `scripts/sync-notion.mjs`, qui génère du Markdown + images dans `src/content/blog/`
(dossier nettoyé et régénéré à chaque synchro, donc **gitignoré**).

- **Secrets** : `NOTION_TOKEN` et `NOTION_DATABASE_ID` dans `.env` (voir `.env.example`). Ne jamais lire/afficher le token.
- **Cible** via `SYNC_TARGET` :
  - `prod` (défaut) → ne prend que les articles `Statut = "Publié"`
  - `staging` → prend aussi `Statut = "En relecture"` (et le site est marqué `noindex` — voir SEO)
- **Propriétés Notion attendues** : `Titre`, `Catégorie` (Select), `Résumé`, `Image` (cover, **obligatoire** sinon article ignoré), `Alt image` (texte alt de la cover), `Date`, `Statut` (Select : Brouillon/En relecture/Publié), `Slug` (optionnel).
- **Catégories** : lues depuis les options du Select `Catégorie` → écrites dans `_categories.json`.
- **Mappers purs** (`scripts/lib/notion-mappers.mjs`, testés avec `node --test`) : `slugify`, `makeUniqueSlug`, `mapProperties`, `demoteHeadings` (rétrograde les titres pour garder un seul `<h1>`), `extractImageUrls`, `rewriteImageUrls`, `extFromUrl`, `stripFilenameAlts` (vide l'alt quand c'est un nom de fichier + avertit).
- **Frontmatter** généré via `JSON.stringify` par champ (YAML-safe).

### SEO

- `BaseLayout.astro` accepte `title`, `description?`, `image?` (ImageMetadata|string), `type?` (`website`|`article`) et produit : `<meta name="description">`, **Open Graph** (`og:*`), **Twitter Card** (`summary_large_image`), `canonical`. `og:image` par défaut = `logo.svg` (idéalement remplacer par une bannière 1200×630).
- **JSON-LD `BlogPosting`** injecté par `blogs/[slug].astro` via `<slot name="head">` (auteur + éditeur = Organization « Scan&Stock »).
- **Sitemap** : `@astrojs/sitemap` (`astro.config.mjs`) → `sitemap-index.xml`, référencé dans `public/robots.txt`.
- **`noindex` staging** : si `import.meta.env.SYNC_TARGET === "staging"`, `BaseLayout` ajoute `<meta name="robots" content="noindex, nofollow">` (évite le contenu dupliqué avec la prod).
- **`rehype-unwrap-images`** (`astro.config.mjs`) retire le `<p>` enveloppant les images seules des articles.

### Composants métier (`src/components/`)

| Composant                 | Rôle                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `NavigationBar.astro`     | Barre de navigation avec détection de la route active                                     |
| `Footer.astro`            | Pied de page                                                                              |
| `ClientsCarousel.astro`   | Carrousel des logos clients (données statiques internes)                                  |
| `FeaturesTabs.astro`      | Onglets de fonctionnalités avec vidéos chargées en lazy                                   |
| `VideoPresentation.astro` | Section vidéo de présentation                                                             |
| `InfoFeatures.astro`      | Liste d'articles/fonctionnalités (2 colonnes, données internes)                           |
| `InfoUsers.astro`         | Témoignages utilisateurs avec photos                                                      |
| `ImgPresentation.astro`   | Section image + texte                                                                     |
| `Carousel.astro`          | Carrousel générique à slots — prop `variant: 'card' \| 'image'`, `withReserve?`, `label?` |
| `CardCarousel.astro`      | Slide de type carte (titre, texte, image) — enfant de `Carousel`                          |
| `ImageCarousel.astro`     | Slide de type image seule — enfant de `Carousel`                                          |
| `BlogCard.astro`          | Carte article (cover + catégorie + titre + résumé) — prop `coverAlt?` pour l'alt          |
| `BlogFilters.astro`       | Filtres de catégories de la page blog — prop `categories: string[]`                       |
| `ContactForm.astro`       | Formulaire de contact (réutilisé en bas des pages)                                        |
| `ReserveButton.astro`     | Bouton CTA Calendly (prop `class?`)                                                       |
| `ThirdPartyScripts.astro` | Isolation de Tawk.to, Calendly, Google Analytics                                          |

### Composants UI (`src/components/ui/`)

| Composant             | Rôle                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ |
| `GradientTitle.astro` | Titre avec dégradé de couleur — prop `as?: "h1"\|"h2"\|"h3"\|"h4"` (`h2` par défaut) |
| `Hero-box.astro`      | Section hero avec parallax au scroll (`requestAnimationFrame`)                       |
| `Main-box.astro`      | Conteneur de section avec prop `class?`                                              |

### Assets (`src/assets/`)

```
photos/         ← Photos utilisateurs et carrousel (PNG/JPG/WebP)
icones/         ← Icônes statiques + animations WebP
images/         ← Images produit (computer, phone, scanner)
*.svg           ← Illustrations vectorielles (stats, order, stock, compare, warning)
logo.svg        ← Logo Scan&Stock
```

### Conventions de style

- **Palette principale** : `#12a19a`, `#3983a3`, `#496f7f`, `#41778c`, `#6065ac` (violet gradient GradientTitle)
- **Breakpoints** : 768 px (tablette), 1024 px (desktop), 1240 px (large)
- Approche **mobile-first** ; les styles desktop sont dans des `@media screen and (min-width: ...)`
- Toujours respecter `@media (prefers-reduced-motion: reduce)` pour les animations
- Typographie responsive via `clamp()` (ex. `clamp(20px, 3vw, 40px)`)

### Patterns de composants

- `is:inline` sur les `<script>` tiers pour éviter le bundling Astro
- `:global()` dans les `<style>` scopés pour cibler des éléments enfants (ex. `.tab.active :global(*)`)
- `class:list` pour les classes conditionnelles (ex. `class:list={["tab", { active: isActive }]}`)
- Props TypeScript avec interface : `GradientTitle` accepte `as?: "h1" | "h2" | "h3" | "h4"` (`h2` par défaut)

### Points d'attention

- **Node 24 obligatoire** (`.nvmrc`) ; `nvm use 24` avant `pnpm dev` (port 4321).
- Le contenu de `src/content/blog/` est **généré** : ne jamais l'éditer à la main, modifier la source Notion.
- **Couverture obligatoire** : un article Notion sans image de couverture est ignoré (avertissement au build).
- L'alt des images d'article = la légende Notion ; sans légende, l'alt est vidé + avertissement (accessibilité/SEO).
- **`GradientTitle`** accepte une prop `as` pour choisir le tag HTML (`h2` par défaut).
- La vidéo YouTube dans `FeaturesTabs.astro` est chargée en lazy via `IntersectionObserver` (attribut `data-src`).
- L'effet parallax dans le hero est géré par un `scroll` listener avec `requestAnimationFrame`.
- La navigation active est détectée avec `Astro.url.pathname === link.href`.
- Les scripts tiers (Tawk.to, Calendly, Google Analytics) sont isolés dans `ThirdPartyScripts.astro`.
