# Plateforme de Paris E-sportifs

Une plateforme complète de paris e-sportifs avec authentification, gestion des matchs et interface utilisateur moderne.

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + Vite
- **Backend** : Node.js + Express
- **Authentification** : JWT + bcryptjs
- **Base de données** : JSON files (développement)
- **Styling** : CSS modules + thème sombre/clair
- **Temps réel** : Socket.io

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/Cynewulf89/Plateforme-de-Paris-E-sportifs.git
cd Plateforme-de-Paris-E-sportifs

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd backend
npm install
cd ..
```

### Lancement en développement
```bash
# Terminal 1 : Backend
cd backend
npm start

# Terminal 2 : Frontend
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:5000

## 👥 Comptes de Test

### Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

### Utilisateur Standard
- **Email** : `test@example.com`
- **Mot de passe** : `password123`

## 📁 Structure du Projet

```
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   └── package.json
├── backend/           # API Express
│   ├── server.js
│   └── package.json
└── data/             # Données JSON
```

## 🎯 Fonctionnalités

### Pour les Utilisateurs
- ✅ Inscription/Connexion
- ✅ Consultation des matchs
- ✅ Placement de paris
- ✅ Suivi des gains/pertes
- ✅ Profil utilisateur

### Pour les Administrateurs
- ✅ Gestion des équipes
- ✅ Gestion des matchs
- ✅ Gestion des utilisateurs
- ✅ Résultats en temps réel

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Prévisualisation
npm run test     # Tests
```

### Backend
```bash
npm start        # Production
npm run dev      # Développement avec nodemon
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.