# Plateforme de Paris E-sportifs

Une plateforme web pour les paris e-sportifs à Paris, construite avec React et Vite.

## Technologies
- **Frontend** : React (JavaScript)
- **Build Tool** : Vite
- **Backend** : À définir (Node.js/Express ou CMS)

## Installation
1. Clonez le dépôt :
   ```
   git clone https://github.com/Cynewulf89/Plateforme-de-Paris-E-sportifs.git
   cd Plateforme-de-Paris-E-sportifs
   ```

2. Installez les dépendances frontend :
   ```
   cd frontend
   npm install
   ```

3. Installez les dépendances backend :
   ```
   cd ../backend
   npm install
   cd ..
   ```

4. Lancez le backend :
   ```
   cd backend
   npm run dev
   ```
   (Dans un autre terminal)

5. Lancez le frontend :
   ```
   cd frontend
   npm run dev
   ```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173), backend sur http://localhost:5000.

**Note** : Pour que l'API fonctionne en local, créez un fichier `.env` dans le dossier `frontend` avec :
```
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Démo en ligne

**Application déployée :** [Plateforme de Paris E-sportifs](http://hwokgc8woogwwco48kg88skg.31.220.75.92.sslip.io/) 

*Cette démo présente toutes les fonctionnalités de la plateforme de paris e-sportifs.*

## 🚀 Déploiement avec Coolify

### Configuration Docker Compose
1. **Connectez votre repository GitHub** à Coolify
2. **Créez un nouveau projet** :
   - Type : `Private Repository (with GitHub App)`
   - Repository : Votre repository GitHub
   - Branch : `dev`
   - Build Pack : `Docker Compose`
   - Docker Compose Location : `/docker-compose.yml`

3. **Configuration** :
   - **Name** : `esports-platform`
   - **Domains for frontend** : `Generate Domain` (URL publique)
   - **Domains for backend** : Laisser vide (interne)
   - **Environment Variables** pour le frontend :
     - `VITE_API_URL=/api`

4. **Déploiement** :
   - Cliquez `Save` puis `Deploy`
   - Attendez 5-10 minutes
   - Votre app sera accessible via l'URL générée

### Architecture Déployée
- **Frontend** : URL publique générée par Coolify (port 80)
- **Backend** : `http://backend:5000` (interne seulement)
- **Base de données** : Fichiers JSON (data/*.json)

### Tests Post-Déploiement
- ✅ Page d'accueil charge
- ✅ Authentification fonctionne
- ✅ API backend répond
- ✅ Paris sportifs opérationnels

## 🏠 Auto-hébergement

Si vous souhaitez déployer cette application sur votre propre infrastructure :

### Prérequis
- Serveur VPS (recommandé : 2GB RAM minimum)
- Docker et Docker Compose installés
- Domaine (optionnel mais recommandé)

### Déploiement rapide
```bash
# 1. Cloner le repository
git clone https://github.com/Cynewulf89/Plateforme-de-Paris-E-sportifs.git
cd Plateforme-de-Paris-E-sportifs

# 2. Lancer avec Docker Compose
docker-compose up -d

# 3. Accéder à l'application
# Frontend : http://localhost:3000
# Backend : http://localhost:5000
```

### Plateformes recommandées
- **Coolify** : Déploiement automatisé (voir section ci-dessus)
- **Railway** : Simple et rapide
- **Vercel + Railway** : Frontend sur Vercel, backend sur Railway
- **DigitalOcean App Platform** : Solution cloud managée

## Scripts disponibles
- `npm run dev` : Lance le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## Fonctionnalités
- Landing page
- Gestion d'équipes et matchs (admin)
- Paris sur matchs (visiteur)
- Résultats et gains/pertes

## 👥 Gestion des Utilisateurs

### Rôles et Permissions

La plateforme utilise un système de rôles pour contrôler l'accès aux fonctionnalités :

#### 👤 Utilisateur Standard (`user`)
- **Inscription** : Gratuite et ouverte à tous
- **Accès** : 
  - Parier sur les matchs
  - Voir les résultats
  - Consulter ses gains/pertes
  - Accéder à son profil
- **Restrictions** : Ne peut pas gérer les équipes/matchs

#### 👑 Administrateur (`admin`)
- **Accès complet** à toutes les fonctionnalités utilisateur
- **Permissions supplémentaires** :
  - Créer/modifier/supprimer des équipes
  - Créer/modifier/supprimer des matchs
  - Gérer les rôles des utilisateurs
  - Accéder aux pages d'administration

### Comptes de Test

Pour tester la plateforme, utilisez ces comptes pré-configurés :

#### Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`
- **Rôle** : Administrateur

#### Utilisateur Standard
- **Email** : `test@example.com`
- **Mot de passe** : `password123`
- **Rôle** : Utilisateur

### Gestion des Utilisateurs (Admin)

Les administrateurs peuvent gérer les rôles des utilisateurs via l'interface :

1. **Connexion** en tant qu'admin
2. **Accéder** à "Admin Utilisateurs" dans la navigation
3. **Modifier** les rôles directement depuis le tableau :
   - Sélectionner "Utilisateur" ou "Admin" dans le menu déroulant
   - La modification est appliquée immédiatement

**Note** : Un administrateur ne peut pas retirer ses propres droits d'admin pour éviter de se bloquer l'accès.

### Sécurité
- **Authentification** : Système de connexion/déconnexion
- **Routes protégées** : Certaines pages nécessitent une authentification
- **Middleware serveur** : Validation des permissions côté backend
- **Données sensibles** : Mots de passe non stockés en clair (hash recommandé en production)

## Contribution
- Travaillez sur la branche `dev`.
- Commitez régulièrement avec des messages clairs.
- Ouvrez une PR vers `main` pour les merges.

## Licence
Ce projet est sous licence MIT.