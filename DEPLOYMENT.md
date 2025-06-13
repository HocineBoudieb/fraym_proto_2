# Guide de Déploiement Rasa Fraym

Ce guide vous explique comment déployer votre application Rasa Fraym :
- **API FastAPI** via ngrok (exposition publique temporaire)
- **Frontend React/Vite** via GitHub Pages (hébergement gratuit)

## 🚀 Déploiement Rapide

### Option 1: Déploiement Automatique

```bash
# Déploiement complet (API + Frontend)
python3 deploy.py

# Déploiement API seulement
python3 deploy.py --api-only

# Déploiement Frontend seulement
python3 deploy.py --frontend-only
```

### Option 2: Déploiement Manuel

#### API via ngrok
```bash
python3 deploy_ngrok.py
```

#### Frontend via GitHub Pages
```bash
cd frontend
pnpm run build
cd ..
git add .
git commit -m "Deploy frontend"
git push origin main
```

## 📋 Prérequis

### Outils Requis
- **Python 3.11+** avec `uv`
- **Node.js 20+** avec `pnpm`
- **Git**
- **ngrok** (pour l'API)
- **Compte GitHub** (pour le frontend)

### Installation des Outils

#### ngrok (macOS)
```bash
# Via Homebrew
brew install ngrok/ngrok/ngrok

# Ou téléchargement direct depuis https://ngrok.com/download
```

#### pnpm
```bash
npm install -g pnpm
```

#### uv
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## ⚙️ Configuration

### 1. Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos clés
nano .env
```

Configurer dans `.env` :
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here

# JWT Configuration
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=file:./dev.db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### 2. Configuration ngrok

```bash
# Créer un compte sur https://ngrok.com
# Récupérer votre authtoken
ngrok config add-authtoken <your-authtoken>
```

### 3. Configuration GitHub

```bash
# Initialiser le repository (si pas déjà fait)
git init
git remote add origin https://github.com/username/rasa_fraym.git

# Première poussée
git add .
git commit -m "Initial commit"
git push -u origin main
```

## 🔧 Déploiement API (ngrok)

### Déploiement

```bash
python3 deploy_ngrok.py
```

### Ce qui se passe :
1. ✅ Vérification de ngrok
2. 🚀 Démarrage du serveur FastAPI (port 8000)
3. 🌐 Création du tunnel ngrok
4. 📋 Affichage de l'URL publique
5. 💾 Sauvegarde des infos dans `deployment_info.json`

### URLs Générées :
- **API publique** : `https://xxxxx.ngrok.io`
- **Documentation** : `https://xxxxx.ngrok.io/docs`
- **Dashboard ngrok** : `http://localhost:4040`

### ⚠️ Important :
- Le tunnel reste actif tant que le terminal est ouvert
- L'URL change à chaque redémarrage (version gratuite)
- Pour une URL fixe, utilisez ngrok Pro

## 🌐 Déploiement Frontend (GitHub Pages)

### Configuration GitHub Pages

1. **Aller sur votre repository GitHub**
2. **Settings** > **Pages**
3. **Source** : GitHub Actions
4. Le workflow se déclenchera automatiquement

### Workflow Automatique

Le fichier `.github/workflows/deploy-frontend.yml` :
- Se déclenche sur push vers `main`
- Build le projet Vite
- Déploie sur GitHub Pages

### Build Manuel

```bash
cd frontend
pnpm install
pnpm run build
```

### URL du Site

```
https://username.github.io/rasa_fraym/
```

## 🔗 Connexion Frontend ↔ API

### Configuration de l'URL API

Dans votre frontend, configurez l'URL de l'API ngrok :

```typescript
// src/config.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-ngrok-url.ngrok.io'
  : 'http://localhost:8000';

export { API_BASE_URL };
```

### CORS

L'API est configurée pour accepter toutes les origines :

```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez votre domaine
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Monitoring et Logs

### API (ngrok)
- **Logs serveur** : Terminal de déploiement
- **Trafic ngrok** : http://localhost:4040
- **Métriques** : Dashboard ngrok

### Frontend (GitHub Pages)
- **Build logs** : Actions GitHub
- **Status** : Settings > Pages
- **Analytics** : GitHub Insights

## 🛠️ Dépannage

### Problèmes Courants

#### ngrok
```bash
# Erreur d'authentification
ngrok config add-authtoken <token>

# Port déjà utilisé
lsof -ti:8000 | xargs kill -9

# Tunnel fermé
# Redémarrer deploy_ngrok.py
```

#### GitHub Pages
```bash
# Build échoué
cd frontend
pnpm run build  # Tester localement

# Permissions GitHub
# Vérifier Settings > Actions > General

# URL incorrecte
# Vérifier base dans vite.config.ts
```

#### API
```bash
# Dépendances manquantes
uv sync

# Base de données
uv run prisma db push

# Variables d'environnement
cp .env.example .env
# Puis configurer .env
```

### Logs Utiles

```bash
# Logs API
tail -f deployment_info.json

# Status GitHub Actions
gh run list  # Si GitHub CLI installé

# Test API locale
curl http://localhost:8000/docs

# Test build frontend
cd frontend && pnpm run build
```

## 🔄 Mise à Jour

### API
```bash
# Arrêter ngrok (Ctrl+C)
# Modifier le code
python3 deploy_ngrok.py  # Redémarrer
```

### Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Le déploiement se fait automatiquement
```

## 🎯 Production

Pour un déploiement en production :

### API
- Utilisez un service cloud (Heroku, Railway, Render)
- Configurez un domaine personnalisé
- Utilisez une base de données PostgreSQL
- Configurez HTTPS

### Frontend
- Utilisez Vercel, Netlify ou Cloudflare Pages
- Configurez un domaine personnalisé
- Optimisez les performances
- Configurez le CDN

## 📞 Support

En cas de problème :
1. Vérifiez les logs
2. Consultez la documentation ngrok/GitHub
3. Testez localement d'abord
4. Vérifiez les permissions et tokens

---

**Bon déploiement ! 🚀**