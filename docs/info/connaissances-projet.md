# Connaissances du Projet : Plateforme de Paris E-sportifs

## Objectif du Projet
Réaliser une plateforme de paris sportifs en ligne spécialisée dans l'e-sport. Il s'agit d'un POC (Proof of Concept) pour convaincre un investisseur des Émirats Arabes Unis. La plateforme doit être fonctionnelle, simple, et inclure des éléments créatifs pour maximiser les chances de financement.

Le projet est révolutionnaire : une plateforme de paris e-sportifs à Paris, avec gestion d'équipes, de matchs et de paris.

## Fonctionnalités Obligatoires
- **Landing Page** : Présentation rapide de l'idée du projet.
- **Admin - Gestion des Équipes** :
  - Créer une nouvelle équipe
  - Uploader une image de profil pour l'équipe
  - Modifier une équipe existante
  - Supprimer une équipe
- **Admin - Gestion des Matchs** :
  - Ajouter un nouveau match
  - Modifier un match en cours
  - Supprimer un match
- **Visiteur - Paris sur les Matchs** :
  - Placer une nouvelle offre de pari sur les matchs ouverts
- **Visiteur - Résultats** :
  - Voir les résultats des matchs
- **Visiteur - Gains et Pertes** :
  - Consulter ses gains et pertes personnels

## Fonctionnalités Optionnelles
- Système d'authentification et de connexion (recommandé pour un vrai projet, mais pas obligatoire ici).
- Utilisation d'un CMS ou solution tierce pour le backend.

## Technologies Utilisées
- **Écosystème** : JavaScript/TypeScript uniquement.
- **Frontend** : React (ou autre framework JS comme Vue/Angular).
- **Backend** : Node.js avec Express, ou solution tierce (CMS comme Strapi).
- **Base de Données** : Export SQL fourni (peut être modifié/ajouté/supprimé). Possibilité d'utiliser MongoDB, PostgreSQL, ou autre.
- **Déploiement** : Libre (GitHub Pages, Vercel, Heroku, etc.).

## Données
- Un export SQL des données est fourni. Vous pouvez le modifier, ajouter ou supprimer des données selon vos besoins.
- Formats de données libres en fonction de l'architecture choisie.

## Design et Ressources
- Un moodboard et une charte graphique sont fournis, mais vous pouvez les ignorer et choisir votre propre style.
- Liens vers ressources disponibles.

## Structure du Projet
- `src/` : Code source frontend
- `public/` : Assets statiques
- `info/` : Documentation du projet
- `server/` : Code backend (si applicable)
- `data/` : Fichiers de données (SQL, JSON, etc.)

## Étapes de Développement
1. Configuration de base (React, backend si nécessaire)
2. Implémentation de la landing page
3. Pages admin pour équipes et matchs
4. Pages visiteur pour paris, résultats et gains
5. Tests, responsive design, et déploiement
6. Ajouts créatifs pour valoriser le POC

## Notes
- Priorité : Simplicité et fonctionnalité pour le POC.
- Évaluation : Chaque fonctionnalité et idée originale sera récompensée.
- Sécurité : Attention aux vulnérabilités (surtout avec les paris).
- Responsive : Doit fonctionner sur mobile et desktop.
- Bonnes pratiques : Git, commits clairs, documentation.

## Grille de Notation (Total : 20/20)
La note est répartie sur quatre axes : fonctionnalité/code, bonnes pratiques, choix techniques, et UX/UI. Des points bonus pour créativité et implication.

### 1. Fonctionnalité et Code (11 points)
- **Code Fonctionnel** : 5 pts - Fonctionnalités implémentées et opérationnelles.
- **Architecture et Structure** : 2 pts - Organisation claire des fichiers/dossiers, séparation des responsabilités.
- **Gestion des Erreurs** : 1 pt - Mécanismes d'erreur (Try/Catch), validation des inputs.
- **Performance de base** : 1 pt - Efficacité, absence de fuites mémoire.
- **.env et Facilité de Test** : 2 pts - Lancement facile sans debug excessif.

### 2. Bonnes Pratiques de Développement (3 points)
- **Git et Versioning** : 1 pt - Commits cohérents, messages clairs, fréquence appropriée.
- **Qualité du Code** : 1 pt - Lisibilité, nommage clair, conventions de style.
- **Documentation Technique** : 1 pt - README complet, commentaires pertinents.

### 3. Choix Technique et Justification (4 points)
- **Pertinence du Framework** : 2 pts - Adaptation au contexte.
- **Justification** : Incluse - Explication des choix (dans framework.md).
- **Utilisation des Outils** : 1 pt - Maîtrise de npm, bundles, etc.
- **Sécurité de base** : 1 pt - Validation/sanitization des données.

### 4. Interface et Expérience Utilisateur (2 points + Bonus)
- **UX/UI** : 2 pts - Ergonomie, responsive, accessibilité.
- **Créativité/Originalité** : Bonus - Approches innovantes.

## Conseils pour Commencer le Projet
1. **Analyser la Demande** : Identifier besoins (données, visuel) → Backend + Frontend.
2. **Choisir le Backend** : API manuelle (Nest, Express) ou CMS (Strapi, Directus) pour CRUD simple.
3. **Préparer les Endpoints** : Définir API, données importantes.
4. **Choisir le Frontend** : Framework adapté (React, Vue), architecture (inspirée de la doc).
5. **Design System** : Wireframes (Balsamiq, Excalidraw), moodboard (couleurs, typo).
6. **Développement** : Fonctionnel d'abord, puis design/animations. Connecter back/front.
7. **Tests et Débogage** : Ajouter tests, déployer (Vercel, Coolify).
8. **Optimisations** : Après prod, monitoring et améliorations.

Rendus en cours : Points bonus pour implication.

Ce document sera mis à jour au fur et à mesure du développement.