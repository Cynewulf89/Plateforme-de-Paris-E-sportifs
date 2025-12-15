# Choix Techniques - Plateforme de Paris E-sportifs

## Justification des Choix Techniques

### Framework Frontend : React
- **Pourquoi React ?** React est un framework JavaScript moderne et populaire pour créer des interfaces utilisateur interactives. Il permet de construire des composants réutilisables, facilitant la gestion d'une application complexe comme une plateforme de paris.
- **Avantages** : Écosystème riche (React Router pour la navigation, hooks pour l'état), performance avec le Virtual DOM, communauté active.
- **Inconvénients** : Courbe d'apprentissage pour les débutants, mais adapté à un POC rapide.
- **Alternatives envisagées** : Vue.js (plus simple pour débutants) ou Angular (plus structuré pour grandes apps), mais React offre plus de flexibilité pour ce projet.

### Outil de Build : Vite
- **Pourquoi Vite ?** Vite est un outil de build ultra-rapide pour les projets JavaScript modernes. Contrairement à Create React App (déprécié), Vite offre un développement plus rapide avec HMR (Hot Module Replacement) et une configuration simple.
- **Avantages** : Démarrage instantané, build optimisé, support natif d'ES modules.
- **Inconvénients** : Moins de "magie" que CRA, mais plus de contrôle.
- **Alternatives** : Webpack ou Parcel, mais Vite est plus moderne et recommandé pour React.

### Backend : Aucun (Mock Data pour POC)
- **Pourquoi pas de backend ?** Pour un POC rapide et simple, nous avons utilisé des données mockées (localStorage pour les paris). Cela permet de démontrer les fonctionnalités sans complexité serveur.
- **Avantages** : Développement rapide, pas de dépendance à une base de données.
- **Inconvénients** : Données non persistantes entre sessions, pas scalable.
- **Pour production** : Utiliser Node.js + Express ou un CMS comme Strapi pour CRUD simple. Base de données : PostgreSQL ou MongoDB.

### Routing : React Router
- **Pourquoi ?** Pour gérer la navigation SPA (Single Page Application) entre les pages (accueil, admin, visiteur).
- **Avantages** : Intégration facile avec React, support des routes imbriquées.

### État et Persistance : useState + localStorage
- **Pourquoi ?** Pour un POC, useState gère l'état local, localStorage persiste les paris entre rechargements.
- **Pour production** : Context API ou Redux pour état global, API REST pour persistance.

### Sécurité
- **Mesures implémentées** : Validation basique des inputs (présence de valeurs), pas de sanitization avancée car pas de backend.
- **Recommandations** : En production, utiliser Helmet pour headers sécurisés, valider/sanitizer toutes les entrées, éviter XSS.

## Fonctionnalités Bonus Ajoutées
- Navigation fluide entre pages avec React Router.
- Calcul automatique des gains (2x si pari gagné).
- Interface responsive (mobile/desktop).
- Validation des inputs avec messages d'erreur.
- Animations CSS de base (fade-in).
- Backend Express avec API REST (équipes, matchs, paris).
- Persistance des données via fichiers JSON.
- Configuration .env pour l'API.
- Structure de projet organisée (front/back séparés).

## Ressources pour Lancer le Projet
### Prérequis
- Node.js 18+ installé.
- Git pour cloner.

### Lancement Local
1. Cloner le repo : `git clone https://github.com/Cynewulf89/Plateforme-de-Paris-E-sportifs.git`
2. Aller dans le dossier : `cd Plateforme-de-Paris-E-sportifs`
3. Installer : `npm install`
4. Lancer : `npm run dev`
5. Ouvrir http://localhost:5173

### Variables d'Environnement
- Aucune pour le POC. Pour production, ajouter `.env` avec clés API si nécessaire.

### Déploiement
- Utiliser Vercel : Connecter le repo GitHub, build automatique.
- Ou Coolify : Suivre le guide `info/deploiement-coolify.md`.

### Tests
- Pas de tests automatisés, mais manuel via navigation.

### Schémas
- **Architecture Fichiers** :
  ```
  src/
  ├── pages/ (Landing, AdminTeams, etc.)
  ├── App.jsx (Routing)
  ├── main.jsx (Entrée)
  └── index.css (Styles globaux)
  ```
- **Architecture Logique** : Composants React avec état local, pas de backend.
- **Communication** : Pas d'API, données mockées.

Ces choix permettent un POC fonctionnel et extensible pour convaincre l'investisseur !