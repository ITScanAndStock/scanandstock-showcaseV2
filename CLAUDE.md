# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
pnpm dev        # Démarre le serveur de dev sur localhost:4200 (--host : accessible sur le réseau local)
pnpm build      # Compile le site statique dans ./dist/
pnpm preview    # Prévisualise le build local
```

> Le serveur de dev tourne sur le port **4200** (non standard pour Astro). Node `>=22.12.0` requis.

## Architecture

Site vitrine statique **Astro 6** pour Scan&Stock (logiciel de gestion de stocks dentaires), déployé sur
`https://www.scanandstock.fr`.

### Couches de l'architecture

```
src/layouts/BaseLayout.astro   ← Layout unique : Montserrat, Calendly, Font Awesome, canonical URL
src/pages/                     ← Routes fichier (index, about, blogs)
src/components/ui/             ← Primitives génériques (GradientTitle, HeroBox, MainBox)
src/components/                ← Composants métier (voir liste complète ci-dessous)
src/styles/                    ← reset.css + global.css (body max-width: 1240px, Montserrat)
src/assets/                    ← Images traitées par Astro (<Image /> avec optimisation WebP via sharp)
src/js/                        ← Scripts IIFE tiers (ex. tawkto.js)
public/                        ← Fichiers statiques non transformés
```

### Composants métier (`src/components/`)

| Composant                 | Rôle                                                                                      |
|---------------------------|-------------------------------------------------------------------------------------------|
| `NavigationBar.astro`     | Barre de navigation avec détection de la route active                                     |
| `ClientsCarousel.astro`   | Carrousel des logos clients (données statiques internes)                                  |
| `FeaturesTabs.astro`      | Onglets de fonctionnalités avec vidéos chargées en lazy                                   |
| `VideoPresentation.astro` | Section vidéo de présentation                                                             |
| `InfoFeatures.astro`      | Liste d'articles/fonctionnalités (2 colonnes, données internes)                           |
| `InfoUsers.astro`         | Témoignages utilisateurs avec photos                                                      |
| `ImgPresentation.astro`   | Section image + texte                                                                     |
| `Carousel.astro`          | Carrousel générique à slots — prop `variant: 'card' \| 'image'`, `withReserve?`, `label?` |
| `CardCarousel.astro`      | Slide de type carte (titre, texte, image) — enfant de `Carousel`                          |
| `ImageCarousel.astro`     | Slide de type image seule — enfant de `Carousel`                                          |
| `ReserveButton.astro`     | Bouton CTA Calendly (prop `class?`)                                                       |
| `ThirdPartyScripts.astro` | Isolation de Tawk.to, Calendly, Google Analytics                                          |

### Composants UI (`src/components/ui/`)

| Composant             | Rôle                                                                                 |
|-----------------------|--------------------------------------------------------------------------------------|
| `GradientTitle.astro` | Titre avec dégradé de couleur — prop `as?: "h1"\|"h2"\|"h3"\|"h4"` (`h2` par défaut) |
| `HeroBox.astro`       | Section hero avec parallax au scroll (`requestAnimationFrame`)                       |
| `MainBox.astro`       | Conteneur de section avec prop `class?`                                              |

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

- **`GradientTitle`** accepte une prop `as` pour choisir le tag HTML (`h2` par défaut).
- La vidéo YouTube dans `FeaturesTabs.astro` est chargée en lazy via `IntersectionObserver` (attribut `data-src`).
- L'effet parallax dans le hero est géré par un `scroll` listener avec `requestAnimationFrame`.
- La navigation active est détectée avec `Astro.url.pathname === link.href`.
- Les scripts tiers (Tawk.to, Calendly, Google Analytics) sont isolés dans `ThirdPartyScripts.astro`.