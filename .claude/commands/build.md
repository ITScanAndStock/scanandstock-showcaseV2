# /build — Pipeline de création : spec → plan → implémentation → review

Ce command orchestre le pipeline complet de création pour scanandstock-showcaseV2.  
Il s'applique à tout ajout : nouveau composant, nouvelle section, nouvelle page, ou modification fonctionnelle
significative.

**Usage** : `/build [description de ce que tu veux créer]`

---

## Vue d'ensemble du pipeline

```
[1] astro-spec-writer         → document de spec exhaustif + mockup ASCII
[1b] astro-wireframe          → maquette HTML/CSS (optionnel, si l'utilisateur le demande)
[2] writing-plans             → plan d'implémentation approuvé
[3] astro-frontend-implementer → code produit
[4] astro-code-reviewer       → rapport de vérification
```

Chaque étape est **bloquante** : ne passe à la suivante qu'après validation explicite de l'utilisateur.

---

## Étape 1 — Rédaction des spécifications

Lance l'agent `astro-spec-writer` avec la description fournie par l'utilisateur.

L'agent va :

- Identifier les ambiguïtés dans la demande
- Poser toutes ses questions en un seul bloc
- Proposer des ajustements si la demande s'écarte des conventions du site
- Produire un document de spec structuré (sections 1 à 11 + tableau Décisions)
- Sauvegarder le tout dans `.features/NNN-[slug].md` (numéro auto-incrémenté)

**Le fichier feature est la source de vérité unique pour toutes les étapes suivantes.** Retiens son chemin exact (ex. `.features/001-section-temoignages.md`) — tu le fourniras à chaque agent.

**Point de validation** : Présente la spec à l'utilisateur. Attends une confirmation explicite avant de passer à l'étape suivante. Si l'utilisateur demande des modifications, relance `astro-spec-writer` qui mettra à jour le fichier feature existant.

À la fin de la spec, `astro-spec-writer` pose automatiquement la question sur la maquette HTML/CSS. Recueille la réponse et oriente vers l'étape 1b ou directement vers l'étape 2.

---

## Étape 1b — Maquette HTML/CSS (optionnelle)

Cette étape s'exécute **uniquement si l'utilisateur répond "oui"** à la question posée par `astro-spec-writer`.

Lance l'agent `astro-wireframe` en lui fournissant le chemin du fichier feature (ex. `.features/001-section-temoignages.md`).

L'agent va :

- Produire un fichier HTML/CSS autonome dans `.wireframes/[nom]-wireframe.html`
- Simuler les couleurs, typographies, espacements, et interactions décrits dans la spec
- Lister les points à valider visuellement

**Point de validation** : Demande à l'utilisateur d'ouvrir le fichier dans son navigateur et de confirmer que le rendu correspond à ses attentes. Si des ajustements sont nécessaires, relance `astro-wireframe` avec les corrections — sans modifier la spec (les corrections visuelles restent dans la boucle wireframe, sauf si elles révèlent un problème fonctionnel). Quand l'utilisateur valide le rendu, passe à l'étape 2.

---

## Étape 2 — Création du plan d'implémentation

Utilise le skill `superpowers:writing-plans` en lui fournissant le contenu de `.features/NNN-slug.md` comme contexte.

Le plan doit inclure :

- La liste ordonnée des fichiers à créer et modifier
- Les dépendances entre les fichiers (quel fichier créer en premier)
- Les props TypeScript de chaque nouveau composant
- Les points de décision qui méritent une validation préalable
- Les risques identifiés (accessibilité, compatibilité, performance)

Une fois le plan rédigé, **ajoute-le dans le fichier feature** entre les balises `<!-- PLAN:START -->` et `<!-- PLAN:END -->`, et mets à jour le statut à `plan`.

**Point de validation** : Présente le plan à l'utilisateur. Attends une confirmation explicite avant de lancer l'implémentation. C'est le dernier moment pour ajuster la portée avant que le code soit écrit.

---

## Étape 3 — Implémentation

Lance l'agent `astro-frontend-implementer` en lui fournissant le chemin du fichier feature (ex. `.features/001-section-temoignages.md`). L'agent lira lui-même la spec et le plan.

L'agent va :

- Lire le fichier feature et mettre le statut à `en cours`
- Poser ses questions préalables si des ambiguïtés subsistent
- Implémenter fichier par fichier selon l'ordre du plan
- Valider l'accessibilité WCAG 2.1 AA pour chaque composant produit

**Point de validation** : Une fois l'implémentation terminée, informe l'utilisateur avant de lancer la review.

---

## Étape 4 — Revue de code

Lance l'agent `astro-code-reviewer` en lui fournissant le chemin du fichier feature (ex. `.features/001-section-temoignages.md`). L'agent lira lui-même la spec, le plan, et les décisions.

L'agent va produire un rapport structuré avec verdict : `APPROUVÉ` / `APPROUVÉ AVEC RÉSERVES` / `REFUSÉ`, mettre à jour le tableau Décisions si nécessaire, et sur verdict positif : supprimer le bloc plan du fichier feature et passer le statut à `livré`.

**Si REFUSÉ** : relance `astro-frontend-implementer` avec le chemin du fichier feature et la liste des problèmes bloquants. Répète l'étape 4 jusqu'à obtenir `APPROUVÉ` ou `APPROUVÉ AVEC RÉSERVES`.

**Si APPROUVÉ** : le fichier `.features/NNN-slug.md` est propre (spec + décisions uniquement). Présente le résumé du travail réalisé à l'utilisateur et propose de commit.

---

## Règles de conduite du pipeline

- **Ne jamais sauter une étape** : pas d'implémentation sans spec approuvée, pas d'implémentation sans plan approuvé.
- **Ne jamais inférer une validation** : attendre une confirmation textuelle explicite à chaque point de validation.
- **Si l'utilisateur interrompt le pipeline** : reprendre là où il s'était arrêté au prochain message, en résumant
  l'étape en cours en une phrase.
- **Si une ambiguïté bloque une étape** : poser la question à l'utilisateur, pas au prochain agent.
