# Guide Déploiement Coolify - Plateforme E-sport

## 🚀 Déploiement sur Coolify

### Architecture
- **Frontend** : React + Vite (port 80)
- **Backend** : Express.js (port 5000)
- **Base de données** : JSON files (data/*.json)

### Services Coolify à créer

#### 1. Service Frontend
**Configuration :**
- Name: `esports-frontend`
- Build Pack: `Docker Compose`
- Docker Compose File: `docker-compose.yml`
- Service: `frontend`
- Build Context: `.`
- Port: `80`
- Environment Variables:
  - `REACT_APP_API_URL=http://esports-backend:5000`

#### 2. Service Backend
**Configuration :**
- Name: `esports-backend`
- Build Pack: `Docker Compose`
- Docker Compose File: `docker-compose.yml`
- Service: `backend`
- Build Context: `./server`
- Port: `5000`

### Domaines
- Frontend: `https://esports-app.coolify.io` (domaine public)
- Backend: `http://esports-backend:5000` (interne seulement)

### Déploiement
1. Créer les 2 services séparément
2. Déployer le backend en premier
3. Déployer le frontend
4. Tester l'application

### URLs finales
- Application: `https://[votre-domaine]`
- API Backend: `http://esports-backend:5000` (accessible depuis frontend seulement)</content>
<parameter name="filePath">/home/cynewulf/Documents/Formation/Andy/Plateforme-de-Paris-E-sportifs/info/deploiement-coolify.md