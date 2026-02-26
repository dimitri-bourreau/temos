# Temos

Application personnelle de suivi du temps de travail, inspirée de [Tyme](https://www.tyme-app.com/en/) mais beaucoup plus simple. Toutes les données sont stockées localement dans le navigateur via IndexedDB.

## Fonctionnalités

- **CRUD tâches de travail** : créer, modifier, supprimer des entrées de temps avec catégorie, description, horaires
- **CRUD catégories** : organiser les entrées par catégorie avec couleur et icône
- **Timer rapide** : chronomètre start/stop qui crée automatiquement une entrée
- **Calendrier** : vue mois et semaine avec blocs colorés par catégorie
- **Statistiques** : par jour/semaine/mois/année avec graphiques animés (barres, ligne, camembert)
- **Horaires de travail** : définir heures cible/jour et jours de repos
- **Export/Import** : toutes les données au format JSON
- **Thème** : clair, sombre, système (synchro OS)
- **Langue** : anglais, français, système (synchro OS)
- **Responsive** : desktop, tablette, mobile

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | shadcn/ui + Radix |
| CSS | Tailwind CSS v4 |
| State | Zustand |
| Persistence | Dexie.js (IndexedDB) |
| Graphiques | Recharts |
| Animations | Framer Motion |
| i18n | next-intl |
| Thème | next-themes |
| Tests | Vitest |

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer les tests
npx vitest run

# Build de production
npm run build
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
├── app/                    # Pages (Next.js App Router)
├── components/
│   ├── atoms/              # Composants simples réutilisables
│   ├── molecules/          # Combinaisons d'atomes
│   ├── organisms/          # Sections de page complètes
│   ├── templates/          # Layouts de page
│   └── ui/                 # shadcn/ui
├── features/               # Logique métier par domaine
│   ├── entries/services/   # CRUD entrées de temps
│   ├── categories/services/# CRUD catégories
│   ├── timer/services/     # Timer start/stop
│   ├── statistics/services/# Calcul statistiques
│   ├── settings/services/  # Paramètres utilisateur
│   └── data-exchange/      # Export/import JSON
├── db/                     # Base Dexie (IndexedDB)
├── hooks/                  # Hooks React partagés
├── lib/                    # Utilitaires
└── types/                  # Interfaces TypeScript
i18n/traductions/           # Fichiers de traduction EN/FR
```

## Architecture

- **Pages** : uniquement du rendu et composition de composants
- **Composants** : design atomique (atoms -> molecules -> organisms -> templates)
- **Features** : logique métier par domaine, chaque service = 1 fichier = 1 fonction testée
- **Persistence** : IndexedDB via Dexie.js, stores Zustand synchronisés

## Scripts

```bash
npm run dev       # Serveur de développement (Turbopack)
npm run build     # Build de production
npm run start     # Lancer le build de production
npm run lint      # Linter ESLint
npx vitest run    # Lancer tous les tests
npx vitest        # Mode watch
```
