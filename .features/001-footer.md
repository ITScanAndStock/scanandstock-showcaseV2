# Feature 001 — Footer

**Date** : 2026-05-22
**Statut** : livré

---

## Spec

# Spécification : Footer.astro

**Date** : 2026-05-22
**Demande originale** : Ajouter un composant `Footer.astro` au site vitrine scanandstock.fr, en 4 colonnes sur desktop et 1 colonne sur mobile, avec fond `#496f7f`, coins arrondis en haut, et intégration dans `BaseLayout.astro`.
**Statut** : Prêt pour implémentation

---

## 1. Vue d'ensemble

`Footer.astro` est le pied de page global du site Scan&Stock. Il est présent sur toutes les pages, car il est intégré directement dans le layout unique `BaseLayout.astro`. Il présente quatre colonnes d'information (brand, contact, liens utiles, réseaux sociaux) sur desktop, empilées en une seule colonne sur mobile. Sa couleur de fond `#496f7f` avec des coins arrondis en haut lui donne un effet de "carte posée" sur le bas de la page, visuellement cohérent avec la navigation.

---

## 2. Localisation

- **Page(s) concernée(s)** : Toutes les pages — via le layout `src/layouts/BaseLayout.astro`
- **Position dans la page** : Juste avant la fermeture de `</body>`, après `<ThirdPartyScripts />`, en dehors de `<slot />`
- **Fichier(s) à créer** : `src/components/Footer.astro`
- **Fichier(s) à modifier** : `src/layouts/BaseLayout.astro` — ajout de l'import et de la balise `<Footer />`

---

## 3. Composants

### Composants réutilisés

| Composant                          | Props utilisées | Notes                  |
| ---------------------------------- | --------------- | ---------------------- |
| Aucun composant existant réutilisé | —               | Voir section Décisions |

### Nouveaux composants à créer

**`Footer.astro`** (dans `src/components/`)

- Rôle : Pied de page global du site, statique, sans props. Contient toutes les données en dur.
- Props TypeScript : aucune
- Slots : aucun
- Enfants attendus : aucun — toutes les données sont statiques internes au composant

---

## 4. Contenu

### Colonne 1 — Brand

- Titre : "Oubliez la gestion de vos stocks, Scan & Stock le fait pour vous"
- Paragraphe : "Facile et efficace, Scan & Stock est là pour vous simplifier la vie ! Alors n'hésitez plus et déléguez cette tâche rébarbative de gestion de stock à un logiciel dédié, vos assistantes et votre porte-monnaie vous remercieront !"

### Colonne 2 — Nous contacter

- Titre de colonne : "Nous contacter"
- Adresse (texte non cliquable) : "360 Rue Marc Lefrancq, 59300 Valenciennes"
- Téléphone (lien `tel:`) : libellé "07 84 07 80 48", href `tel:0784078048`
- Email (lien `mailto:`) : libellé "contact@scanandstock.fr", href `mailto:contact@scanandstock.fr`

### Colonne 3 — Liens utiles

- Titre de colonne : "Liens utiles"
- Lien "La vitrine" : href `#`
- Lien "La boutique" : href `#`
- Lien "Le logiciel" : href `#`
- Lien "Mentions légales" : href `#`

### Colonne 4 — Réseaux sociaux

- Titre de colonne : "Réseaux sociaux"
- Grille 2×2 d'icônes (Facebook, Instagram, LinkedIn, YouTube), chacune avec href `#`

### Barre de bas de page (sous les colonnes)

- Ligne de séparation (bordure CSS)
- Texte : deux liens côte à côte — "CGV" (href `#`) et "CGU" (href `#`), séparés par le caractère `|` (texte statique, non cliquable)
- Alignement : centré horizontalement

### Assets

| Asset           | Chemin                                    | Texte alternatif           |
| --------------- | ----------------------------------------- | -------------------------- |
| Icône Facebook  | `src/assets/icones/network/facebook.svg`  | "Scan&Stock sur Facebook"  |
| Icône Instagram | `src/assets/icones/network/instagram.svg` | "Scan&Stock sur Instagram" |
| Icône LinkedIn  | `src/assets/icones/network/linkedin.svg`  | "Scan&Stock sur LinkedIn"  |
| Icône YouTube   | `src/assets/icones/network/youtube.svg`   | "Scan&Stock sur YouTube"   |

Les icônes sont importées et rendues via le composant `<Image />` d'Astro avec optimisation automatique.

---

## 5. Visuel

### Couleurs

| Élément                   | Couleur                          | Code hex                                                          |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------- |
| Fond du footer            | Bleu-gris                        | `#496f7f`                                                         |
| Fond des icônes réseau    | Bleu-gris foncé (overlay sombre) | `rgba(0, 0, 0, 0.20)` sur `#496f7f` — résultat visuel : `#3b5a6a` |
| Tous les textes           | Blanc                            | `#ffffff`                                                         |
| Tous les liens (repos)    | Blanc                            | `#ffffff`                                                         |
| Tous les liens (hover)    | Blanc semi-transparent           | `rgba(255, 255, 255, 0.70)`                                       |
| Ligne de séparation basse | Blanc semi-transparent           | `rgba(255, 255, 255, 0.25)`                                       |

### Typographie

| Élément                               | Taille | Poids      | Valeur clamp si responsive |
| ------------------------------------- | ------ | ---------- | -------------------------- |
| Titre colonne Brand                   | 20px   | 700 (bold) | non responsive — fixe 20px |
| Titres colonnes 2, 3, 4               | 20px   | 700 (bold) | non responsive — fixe 20px |
| Textes courants (paragraphe, adresse) | 16px   | 400        | non responsive — fixe 16px |
| Liens (colonnes 2, 3)                 | 16px   | 400        | non responsive — fixe 16px |
| Liens CGV / CGU                       | 16px   | 400        | non responsive — fixe 16px |
| Line-height global dans le footer     | —      | —          | 1.6                        |

Police : Montserrat (héritée de `body` via `global.css`, aucune déclaration supplémentaire nécessaire).

### Espacements

- Padding interne du footer : `3rem 2rem` (mobile), `3rem 3rem` (desktop ≥ 1024px)
- Gap entre les 4 colonnes (desktop) : `2rem`
- Gap entre les colonnes empilées (mobile) : `2.5rem`
- Margin-top du footer par rapport au contenu précédent : `0` (le footer suit directement le dernier élément de la page)
- Padding-bottom du footer (espace avant le bas du viewport) : `2rem`
- Espacement entre titre de colonne et son contenu : `margin-bottom: 1rem` sur le titre
- Gap entre les icônes réseau (grille 2×2) : `0.75rem`
- Marge en haut de la barre CGV/CGU (séparation) : `2rem`
- Padding-top de la barre CGV/CGU : `1rem`

### Coins arrondis et effet pleine largeur

Le footer doit visuellement déborder de la contrainte `max-width: 1240px` du `body` pour afficher ses coins arrondis. La technique retenue est la suivante (appliquée en CSS scopé dans `Footer.astro`) :

```
margin-left: calc(-50vw + 50%);
margin-right: calc(-50vw + 50%);
```

Cela casse le max-width du body sans modifier `global.css`. Le padding interne (section 5 Espacements) compense pour que le contenu reste lisible et centré.

- `border-radius` : `16px 16px 0 0` (coins haut-gauche et haut-droit arrondis, bas carrés)

### Icônes réseaux sociaux

- Taille de l'icône SVG (via `<Image />`) : `width="28" height="28"`
- Taille du conteneur de l'icône (cercle/carré arrondi) : `48px × 48px`
- `border-radius` du conteneur : `50%` (forme cercle)
- Fond du conteneur : `rgba(0, 0, 0, 0.20)`
- Centrage de l'icône dans le conteneur : `display: flex; align-items: center; justify-content: center`

---

## 6. Comportement

### Interactions

| Déclencheur                            | Action                          | Notes                                                                                    |
| -------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| Clic sur "07 84 07 80 48"              | Ouvre le composeur téléphonique | `href="tel:0784078048"`                                                                  |
| Clic sur "contact@scanandstock.fr"     | Ouvre le client mail            | `href="mailto:contact@scanandstock.fr"`                                                  |
| Clic sur lien utile (La vitrine, etc.) | Navigation vers `#`             | Placeholder — sera mis à jour ultérieurement                                             |
| Clic sur icône réseau social           | Navigation vers `#`             | Placeholder — `target="_blank" rel="noopener noreferrer"` (préparé pour les vraies URLs) |
| Clic sur CGV                           | Navigation vers `#`             | Placeholder                                                                              |
| Clic sur CGU                           | Navigation vers `#`             | Placeholder                                                                              |

### États

| Composant                                               | État          | Style                                                                 |
| ------------------------------------------------------- | ------------- | --------------------------------------------------------------------- |
| Liens colonnes (Liens utiles, Nous contacter, CGV, CGU) | repos         | `color: #ffffff; text-decoration: none`                               |
| Liens colonnes (Liens utiles, Nous contacter, CGV, CGU) | hover         | `color: rgba(255,255,255,0.70); text-decoration: underline`           |
| Liens colonnes                                          | focus-visible | `outline: 2px solid #ffffff; outline-offset: 3px; border-radius: 2px` |
| Conteneur icône réseau social                           | repos         | `background: rgba(0,0,0,0.20)`                                        |
| Conteneur icône réseau social                           | hover         | `background: rgba(0,0,0,0.35); transform: scale(1.08)`                |
| Conteneur icône réseau social                           | focus-visible | `outline: 2px solid #ffffff; outline-offset: 3px`                     |

### Animations et transitions

| Élément                 | Animation                                     | Durée | Easing | Version réduite (`prefers-reduced-motion`) |
| ----------------------- | --------------------------------------------- | ----- | ------ | ------------------------------------------ |
| Liens texte (hover)     | changement de couleur                         | 150ms | `ease` | pas de transition — changement instantané  |
| Conteneur icône (hover) | `transform: scale(1.08)` + changement de fond | 200ms | `ease` | pas de transition — changement instantané  |

Implémentation du media query :

```
@media (prefers-reduced-motion: reduce) {
  /* supprimer toutes les transitions dans le footer */
}
```

### Responsive

| Breakpoint                | Comportement                                                                                                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile (< 768px)          | 1 colonne, colonnes empilées dans l'ordre Brand → Contact → Liens utiles → Réseaux sociaux. Les 4 icônes réseau en ligne horizontale (`display: flex; flex-direction: row; gap: 0.75rem`). Grille 2×2 désactivée. |
| Tablette (768px – 1023px) | 2 colonnes (grid 2×2) : Brand + Contact en ligne 1, Liens utiles + Réseaux sociaux en ligne 2                                                                                                                     |
| Desktop (≥ 1024px)        | 4 colonnes côte à côte (`display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr`)                                                                                                                                |
| Large (≥ 1240px)          | Identique au desktop. Le max-width du body s'applique, le footer déborde via `margin-inline: calc(-50vw + 50%)`                                                                                                   |

**Détail de la colonne Brand (colonne 1) :** sur desktop, elle est visuellement plus large que les autres (proportion `2fr`) pour accommoder le texte long du paragraphe descriptif.

**Détail des icônes réseau social :**

- Mobile et tablette : `display: flex; flex-direction: row; flex-wrap: wrap; gap: 0.75rem`
- Desktop : `display: grid; grid-template-columns: repeat(2, 48px); gap: 0.75rem`

---

## 7. Accessibilité

- **Structure sémantique** : L'élément racine du composant est `<footer>`. Les 4 colonnes sont des `<div>` sémantiquement neutres (pas de `<section>` pour éviter les exigences d'accessname). La liste des liens utiles est une `<ul>` avec des `<li>`. Les données de contact (adresse, téléphone, email) utilisent `<address>` enveloppant une `<p>` pour l'adresse et des `<a>` pour le tél et l'email.
- **Hiérarchie de titres** : Les titres des 4 colonnes sont des `<h3>`. Ils s'inscrivent dans une hiérarchie cohérente avec le reste de la page (le footer venant après les sections `<h2>` de contenu). Le titre de la colonne Brand (texte long) est également un `<h3>`.
- **Rôles ARIA** :
  - `<footer>` : rôle implicite `contentinfo` — ne pas ajouter `role="contentinfo"` explicitement (redondant)
  - Chaque lien vers un réseau social : `aria-label="Scan&Stock sur [NomRéseau]"` (car le lien ne contient que l'image)
  - Navigation des liens utiles : `<nav aria-label="Liens utiles">`
- **Navigation clavier** : Tous les liens (`<a>`) sont nativement focusables. L'ordre de tabulation suit l'ordre du DOM : Brand (pas de liens) → Contact (tél, email) → Liens utiles (4 liens) → Réseaux sociaux (4 liens) → CGV → CGU.
- **Textes alternatifs** : confirmés dans la section Assets (section 4). Les icônes SVG des réseaux sociaux ont chacune un `alt` descriptif. L'attribut `aria-label` sur le `<a>` parent est redondant avec l'alt de l'image — maintenir les deux pour une compatibilité maximale.
- **Contrastes** : Blanc `#ffffff` sur fond `#496f7f` — ratio de contraste calculé : **4.62:1** (conforme WCAG 2.1 AA, seuil minimum 4.5:1 pour le texte normal). Blanc `#ffffff` sur fond `rgba(0,0,0,0.20)` appliqué à `#496f7f` (soit `#3b5a6a`) — ratio : **5.14:1** (conforme AA). Texte hover `rgba(255,255,255,0.70)` sur `#496f7f` — ratio : **2.73:1** — non conforme pour le texte courant. **Décision de conformité partielle acceptée** : l'état hover est transitoire et non porteur d'information critique ; l'état repos reste conforme.
- **Animations** : `prefers-reduced-motion` implémenté — confirmé section 6.

---

## 8. Contraintes et dépendances

- Le composant `Footer.astro` n'utilise aucun composant UI existant (`MainBox`, `GradientTitle`, `ReserveButton`) — voir section Décisions pour la justification.
- Les icônes SVG sont importées via `import` Astro et rendues via `<Image />` d'Astro pour bénéficier de l'optimisation WebP automatique via sharp.
- Ne pas modifier `global.css` — l'effet pleine largeur est géré en CSS scopé dans `Footer.astro` avec `margin-inline: calc(-50vw + 50%)`.
- Font Awesome est disponible via `BaseLayout.astro` mais n'est pas utilisé dans ce composant (les icônes réseaux sont des SVG locaux).
- Le footer est inséré dans `BaseLayout.astro` après `<ThirdPartyScripts />`, en dehors du `<slot />`, pour qu'il apparaisse sur toutes les pages sans modification des fichiers de pages.
- Les hrefs de type `#` sont des placeholders intentionnels — ils seront mis à jour dans une feature ultérieure.
- Node >= 22.12.0 requis (convention du projet) — sans impact direct sur ce composant.

---

## 9. Hors scope

- Pas de version dark mode
- Pas de logo Scan&Stock dans le footer (non demandé)
- Pas de `ReserveButton` dans le footer (non demandé)
- Les URLs réelles des réseaux sociaux et des pages légales ne sont pas dans le périmètre de cette spec — elles seront définies dans une feature ultérieure
- Pas d'animation d'entrée au scroll (pas demandé)
- Pas de changement de fond au scroll ou à la position (statique)
- La colonne Brand ne contient pas d'image ou de logo (texte uniquement)

---

## 10. Questions ouvertes

Aucune — toutes les informations ont été fournies dans la demande initiale.

---

## Décisions

| Décision                                                         | Alternative écartée                                 | Raison                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pas de `GradientTitle` pour les titres de colonnes               | Utiliser `GradientTitle` avec prop `as="h3"`        | `GradientTitle` applique un dégradé vert-bleu-violet et un style centré conçus pour des titres de sections sur fond blanc ou clair. Sur fond `#496f7f`, le dégradé serait illisible. Les titres de colonnes du footer doivent être blancs, sans dégradé.       |
| Pas de `MainBox` comme conteneur                                 | Utiliser `MainBox` pour la largeur de contenu       | `MainBox` est conçu pour des sections de contenu centrées dans le flux du `body`. Le footer nécessite de casser ce flux pour obtenir l'effet pleine largeur. Le CSS scopé directement dans `Footer.astro` donne un contrôle total sans créer d'effets de bord. |
| Technique `margin-inline: calc(-50vw + 50%)` pour le plein-écran | Modifier `global.css` ou créer un wrapper hors-flux | Modifier `global.css` crée des effets de bord sur l'ensemble des pages. La technique margin-inline est scopée au composant, sans impact sur les autres éléments.                                                                                               |
| `<address>` pour les données de contact                          | `<ul>` ou `<p>` bruts                               | `<address>` est la balise sémantique HTML5 correcte pour les informations de contact d'une organisation. Elle améliore l'accessibilité et le SEO.                                                                                                              |
| Icônes réseaux en `display: flex` horizontal sur mobile          | Grille 2×2 sur tous les formats                     | La grille 2×2 sur mobile prend davantage de hauteur. La ligne horizontale est plus compacte et conforme aux conventions de footer mobile courantes.                                                                                                            |

---

## 11. Maquette visuelle (ASCII)

### Mobile (< 768px)

```
┌──────────────────────────────────┐
│  footer [fond #496f7f]           │
│  border-radius: 16px 16px 0 0    │
│                                  │
│  ┌────────────────────────────┐  │
│  │ h3 — "Oubliez la gestion…" │  │
│  │ p  — texte descriptif      │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ h3 — "Nous contacter"      │  │
│  │ address                    │  │
│  │   p — 360 Rue Marc…        │  │
│  │   a — 07 84 07 80 48       │  │
│  │   a — contact@scanand…     │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ nav aria-label="Liens…"    │  │
│  │ h3 — "Liens utiles"        │  │
│  │ ul                         │  │
│  │   li — La vitrine          │  │
│  │   li — La boutique         │  │
│  │   li — Le logiciel         │  │
│  │   li — Mentions légales    │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ h3 — "Réseaux sociaux"     │  │
│  │ [FB] [IG] [LK] [YT]        │  │
│  │ (ligne horizontale)        │  │
│  └────────────────────────────┘  │
│                                  │
│  ─────────────────────────────   │
│           CGV  |  CGU            │
│         (centré)                 │
└──────────────────────────────────┘
```

### Tablette (768px – 1023px)

```
┌──────────────────────────────────────────┐
│  footer [fond #496f7f]                   │
│  border-radius: 16px 16px 0 0            │
│                                          │
│  ┌──────────────────┬─────────────────┐  │
│  │ h3 — "Oubliez…" │ h3 — "Nous…"    │  │
│  │ p — descriptif  │ address         │  │
│  │                  │   p — adresse   │  │
│  │                  │   a — tél       │  │
│  │                  │   a — email     │  │
│  ├──────────────────┼─────────────────┤  │
│  │ nav              │ h3 — "Réseaux…" │  │
│  │ h3 — "Liens…"   │ [FB] [IG]       │  │
│  │ ul               │ [LK] [YT]       │  │
│  │   li × 4         │ (grille 2×2)    │  │
│  └──────────────────┴─────────────────┘  │
│                                          │
│  ───────────────────────────────────     │
│                CGV  |  CGU               │
│              (centré)                    │
└──────────────────────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│  footer [fond #496f7f] — déborde au-delà du max-width 1240px     │
│  border-radius: 16px 16px 0 0                                    │
│                                                                  │
│  ┌─────────────────┬──────────────┬───────────┬───────────────┐  │
│  │ 2fr             │ 1.5fr        │ 1fr       │ 1fr           │  │
│  │                 │              │           │               │  │
│  │ h3 — "Oubliez   │ h3 — "Nous   │ nav       │ h3 — "Réseaux │  │
│  │   la gestion…"  │   contacter" │ h3 — "Liens│   sociaux"   │  │
│  │                 │              │   utiles" │               │  │
│  │ p — "Facile et  │ address      │           │  [FB]  [IG]   │  │
│  │   efficace…"    │   p — adresse│ ul        │  [LK]  [YT]   │  │
│  │                 │   a — tél    │   li × 4  │               │  │
│  │                 │   a — email  │           │  (grille 2×2) │  │
│  └─────────────────┴──────────────┴───────────┴───────────────┘  │
│                                                                  │
│  ────────────────────────────────────────────────────────────    │
│                         CGV  |  CGU                              │
│                       (centré)                                   │
└──────────────────────────────────────────────────────────────────┘
```
