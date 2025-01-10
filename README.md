# CrypTOP - Application de Gestion de Portefeuille Crypto

## Introduction

CrypTOP est une application web permettant de gérer facilement et en toute sécurité votre portefeuille de cryptomonnaies. Elle offre une interface utilisateur intuitive pour suivre les prix des cryptomonnaies, consulter l'historique des transactions et gérer votre profil.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- Node
- npm (Node Package Manager)

## Installation

Pour installer les dépendances nécessaires, exécutez la commande suivante :

```sh
npm install
```

## Démarrage
Pour démarrer l'application en mode développement, exécutez la commande suivante :

```sh
npm run dev
```

## Fonctionnalités
### Authentification
L'application utilise un contexte d'authentification pour gérer les utilisateurs. Vous pouvez vous inscrire, vous connecter et gérer votre profil.

### Navigation
L'application utilise react-router-dom pour la navigation entre les différentes pages :

**Landing** : Page d'accueil
**Dashboard** : Tableau de bord utilisateur
**Market** : Suivi des prix des cryptomonnaies
**Wallet** : Gestion du portefeuille
**Profile** : Gestion du profil utilisateur

### Graphiques
L'application utilise chart.js et react-chartjs-2 pour afficher les graphiques des prix des cryptomonnaies.

### API
L'application utilise l'API de CoinGecko pour récupérer les données des cryptomonnaies. Les clés API sont stockées dans le fichier .env.

### Structure du Projet
Voici la structure des dossiers du projet :

#### Fichiers principaux
- `.env`: Variables d'environnement
- `.gitignore`: Exclusions de fichiers/dossiers pour Git
- `eslint.config.js` : Configuration ESLint pour maintenir la qualité du code
- `index.html` : Fichier HTML principal
- `package.json` : Liste des dépendances et scripts du projet
- `postcss.config.js` : Configuration PostCSS
- `tailwind.config.js` : Configuration de Tailwind CSS
- `vite.config.js` : Configuration de Vite
- 
#### Répertoires
- `public/` : Fichiers statiques accessibles directement (ex. : images, favicon, etc.)
- `src/` : Contient tout le code source de l'application React

```bash
src/
│
├── App.css          # Style global de l'application
├── App.jsx          # Composant racine de l'application
├── index.css        # Style CSS principal
├── main.jsx         # Point d'entrée de l'application
│
├── assets/          # Fichiers d'images, icônes et autres ressources
│
├── components/      # Composants réutilisables
│   ├── AuthModal.jsx            # Modal pour l'authentification
│   ├── CryptoRow.jsx            # Ligne représentant une crypto-monnaie
│   ├── Navbar.jsx               # Barre de navigation
│   └── Chart/                   # Sous-dossier pour les graphiques
│       ├── Chart.jsx            # Composant principal du graphique
│       └── CustomLineChart.jsx  # Graphique personnalisé (ligne)
│
├── contexts/        # Gestion des états globaux avec Context API
│   └── AuthContext.jsx          # Contexte pour l'authentification
│
├── hooks/           # Hooks personnalisés (vide ou à compléter)
│
├── pages/           # Pages principales de l'application
│   ├── Dashboard.jsx            # Page d'accueil connectée
│   ├── Landing.jsx              # Page d'accueil publique
│   ├── Market.jsx               # Page pour explorer le marché
│   ├── Profile.jsx              # Page du profil utilisateur
│   └── Wallet.jsx               # Page du portefeuille crypto
│
└── utils/           # Fonctions utilitaires
    └── fetchCryptos.jsx         # Récupération des données des crypto-monnaies
```

### Dépendances
Voici les principales dépendances utilisées dans ce projet :

- React
- React Router DOM
- Chart.js
- React Chart.js 2
- Tailwind CSS
- Vite