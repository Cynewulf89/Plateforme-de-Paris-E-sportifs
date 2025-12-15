# 🚀 Guide de Déploiement - Plateforme E-sport

## Architecture Recommandée : Services Séparés

### ✅ Pourquoi Services Séparés ?
- **Évolutivité** : Frontend et backend scalent indépendamment
- **Technologies** : Frontend React, Backend Node.js
- **Déploiement** : Zéro downtime, déploiement séparé
- **Sécurité** : API isolée du frontend
- **Performance** : Cache CDN optimisé pour le frontend

## 🛠️ Configuration Coolify

### Service 1 : Frontend
```
Repository : Cynewulf89/Plateforme-de-Paris-E-sportifs
Branch : dev
Build Pack : Dockerfile
Base Directory : /
Dockerfile Location : /Dockerfile
Domain : Généré automatiquement
Environment Variables :
  - REACT_APP_API_URL=https://[backend-url]/api
```

### Service 2 : Backend
```
Repository : Cynewulf89/Plateforme-de-Paris-E-sportifs
Branch : dev
Build Pack : Dockerfile
Base Directory : /server
Dockerfile Location : /server/Dockerfile
Domain : Généré automatiquement
Port : 5000
Environment Variables :
  - NODE_ENV=production
  - PORT=5000
```

## 🔧 Variables d'Environnement

### Frontend
```bash
REACT_APP_API_URL=https://backend-service.sslip.io/api
```

### Backend
```bash
NODE_ENV=production
PORT=5000
```

## 📋 Checklist Déploiement

### ✅ Avant déploiement
- [ ] Code committé et poussé sur dev
- [ ] Build local réussi (`npm run build`)
- [ ] Tests passent
- [ ] Variables d'environnement configurées

### ✅ Service Frontend
- [ ] Repository connecté
- [ ] Dockerfile à la racine
- [ ] Variables REACT_APP_* configurées
- [ ] Domain généré
- [ ] Déploiement réussi

### ✅ Service Backend
- [ ] Repository connecté
- [ ] Base Directory : /server
- [ ] Dockerfile dans /server/
- [ ] Port 5000 exposé
- [ ] Variables NODE_ENV et PORT
- [ ] Domain généré
- [ ] API répond sur /api/*

### ✅ Post-déploiement
- [ ] Frontend charge correctement
- [ ] API backend accessible
- [ ] Authentification fonctionne
- [ ] Routes protégées opérationnelles
- [ ] Tests end-to-end passent

## 🐛 Dépannage

### Erreur "Connection Refused"
- Vérifier URL backend dans REACT_APP_API_URL
- Vérifier port 5000 exposé dans backend
- Vérifier logs backend pour erreurs de démarrage

### Erreur Build Frontend
- Vérifier Dockerfile à la racine
- Vérifier node_modules dans .dockerignore
- Vérifier variables d'environnement

### Erreur Build Backend
- Vérifier Base Directory : /server
- Vérifier Dockerfile dans /server/
- Vérifier PORT=5000 dans variables

## 📊 URLs de Production

Après déploiement réussi :
```
Frontend : https://[frontend-id].sslip.io
Backend  : https://[backend-id].sslip.io
API      : https://[backend-id].sslip.io/api
```

## 🎯 Performance

### Optimisations Frontend
- ✅ Build de production
- ✅ Compression Gzip
- ✅ Cache CDN Coolify
- ✅ Images optimisées

### Optimisations Backend
- ✅ NODE_ENV=production
- ✅ Port 5000 optimisé
- ✅ Logs en production
- ✅ CORS configuré

## 🔒 Sécurité

### Variables Sensibles
- ✅ Pas de secrets en dur
- ✅ Variables d'environnement utilisées
- ✅ CORS restrictif en production
- ✅ HTTPS forcé

### Bonnes Pratiques
- ✅ Ports non-standard (5000 au lieu de 3000)
- ✅ Utilisateur non-root dans containers
- ✅ Dependencies à jour
- ✅ Logs sécurisés

---

**🎉 Déploiement réussi = Architecture professionnelle !**