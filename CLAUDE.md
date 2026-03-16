# MathQuiz — math-learner

## Projet

Application web éducative pour apprendre les maths en s'amusant. Deux modes principaux :
- **Mode enfant** (GS/CP/CE1) : additions/soustractions simples + puzzles à débloquer + casse-briques
- **Mode avancé** : multiplication, division, addition, soustraction avec timer et difficultés

URL : `https://etienne-bernoux.github.io/math-learner/`

## Stack

- **HTML/CSS/JS** — ES modules, zéro dépendance build
- **Tailwind CSS** — via CDN
- **Hébergement** — GitHub Pages
- **Tests** — Vitest (unit, co-localisés `.spec.js`) + Playwright BDD (e2e, Gherkin FR)
- Pas de framework, pas de bundler

## Architecture

```
math-learner/
├── index.html                          # Squelette HTML, div#root
├── css/style.css                       # Animations custom
├── src/
│   ├── domain/                         # Logique pure, pas de DOM
│   │   ├── donnees/                    # Données (puzzles, achievements, difficulty, etc.)
│   │   ├── quiz/                       # Génération questions, calcul score
│   │   ├── achievements/               # Vérification achievements
│   │   ├── puzzles/                    # Progression puzzles (pièces, complétion, vies)
│   │   ├── breakout/                   # Niveaux, physique, collisions
│   │   ├── persistence/                # localStorage adapter (injectable)
│   │   └── cheat/                      # Détecteur triple $ (réutilisable)
│   └── ui/
│       ├── app.js                      # Shell — state machine + navigation
│       ├── navigation.js               # afficherEcran utility
│       ├── ecrans/                     # Un fichier par écran (initialiser*)
│       └── composants/                 # Composants partagés (confetti, grille-puzzle, etc.)
├── tests/e2e/
│   ├── features/*.feature
│   └── steps/*.steps.js
├── package.json
├── vitest.config.js
└── playwright.config.js
```

### Principes DDD

- **domain/** : fonctions pures, pas de `document`, pas de DOM → testables avec Vitest
- **ui/** : chaque écran exporte `initialiser(container, state, actions)` qui rend le HTML et câble les events
- **donnees/** : données immutables (`Object.freeze`), single source of truth
- Tests unitaires co-localisés (`*.spec.js` à côté du source)

### Navigation

State machine dans `app.js` avec un seul `navigate(screen)` qui :
1. Appelle le cleanup de l'écran précédent
2. Rend le nouvel écran dans `div#root`
3. Câble les actions de navigation

### Écrans (17)

| Écran | Fichier | Description |
|-------|---------|-------------|
| home | accueil.js | Choix mode enfant / avancé |
| menu | menu-avance.js | Sélection opération |
| stats | stats.js | Statistiques + badges |
| config | config-tables.js | Config ×/÷ |
| config | config-plage.js | Config +/− |
| quiz | quiz.js | Quiz avancé (timer) |
| result | resultat.js | Résultats avancé |
| kids-menu | menu-enfant.js | Menu enfant |
| kids-config | config-enfant.js | Config enfant |
| kids-quiz | quiz-enfant.js | Quiz enfant |
| kids-result | resultat-enfant.js | Résultats enfant |
| puzzles | galerie-puzzles.js | Galerie puzzles |
| breakout | breakout.js | Casse-briques canvas |

## Conventions

- Pas de dépendance externe sauf Tailwind CDN
- localStorage pour stats + puzzles + niveau breakout
- Commits conventional en français
- Tests : domain = Vitest specs co-localisés, UI = Playwright BDD Gherkin FR
