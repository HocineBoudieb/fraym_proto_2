# Rasa Fraym API Proxy

Une API FastAPI servant de proxy entre une application web et l'API OpenAI Assistant.

## Fonctionnalités

- Authentification par clé API
- Gestion des sessions de chat
- Stockage des conversations dans une base de données SQLite
- Proxy vers l'API OpenAI Assistant
- Gestion des threads OpenAI

## Installation

Ce projet utilise [uv](https://docs.astral.sh/uv/) pour la gestion des dépendances Python et [Prisma](https://prisma.io) pour l'ORM.

### Prérequis
- Python 3.11+
- uv installé
- Node.js 20+ avec pnpm
- Une clé API OpenAI
- Un assistant OpenAI déjà configuré

### Installation des dépendances

```bash
# Installer les dépendances Python
uv sync

# Générer le client Prisma
uv run prisma generate

# Créer la base de données
uv run prisma db push

# Installer les dépendances frontend
cd frontend
pnpm install
cd ..
```

### Configuration

Copiez le fichier `.env.example` en `.env` et remplissez les variables d'environnement :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos propres valeurs :

```env
# OpenAI Configuration
OPENAI_API_KEY=votre_clé_api_openai
OPENAI_ASSISTANT_ID=votre_id_assistant

# JWT Configuration
SECRET_KEY=votre_clé_secrète_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=file:./dev.db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

## 🚀 Déploiement

### Déploiement Rapide

```bash
# Déploiement complet (API + Frontend)
python3 deploy.py

# API seulement (via ngrok)
python3 deploy.py --api-only

# Frontend seulement (via GitHub Pages)
python3 deploy.py --frontend-only
```

### Déploiement Manuel

#### API via ngrok
```bash
python3 deploy_ngrok.py
```

#### Frontend via GitHub Pages
1. Configurez GitHub Pages dans les settings du repository
2. Poussez vos changements sur la branche `main`
3. Le déploiement se fait automatiquement via GitHub Actions

📖 **Guide complet** : Voir [DEPLOYMENT.md](DEPLOYMENT.md)

## 🏃‍♂️ Développement Local

## Utilisation

### Démarrer le serveur de développement

```bash
uv run python main.py
```

Ou avec uvicorn directement :

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

L'API sera accessible à l'adresse : http://localhost:8000

### Documentation automatique

- Swagger UI : http://localhost:8000/docs
- ReDoc : http://localhost:8000/redoc

## Endpoints disponibles

### Authentification

#### POST /auth/register
Crée un nouvel utilisateur et génère une clé API

**Corps de la requête :**
```json
{
  "name": "Nom utilisateur",
  "email": "email@exemple.com"
}
```

#### POST /auth/login
Authentifie un utilisateur avec sa clé API et retourne un token JWT

**En-tête :**
```
X-API-Key: votre_clé_api
```

### Sessions

#### POST /sessions
Crée une nouvelle session de chat

**Corps de la requête :**
```json
{
  "title": "Titre de la session" // optionnel
}
```

#### GET /sessions
Récupère toutes les sessions de l'utilisateur

#### GET /sessions/{session_id}/messages
Récupère les messages d'une session

### Chat

#### POST /sessions/{session_id}/chat
Envoie un message à OpenAI et retourne la réponse

**Corps de la requête :**
```json
{
  "content": "Votre message ici"
}
```

### Utilitaires

#### GET /
Point d'entrée principal de l'API

#### GET /health
Vérification de l'état de santé du service

## Structure du projet

```
rasa_fraym/
├── main.py              # Application FastAPI principale
├── auth.py              # Service d'authentification
├── openai_service.py    # Service OpenAI
├── models.py            # Modèles Pydantic
├── config.py            # Configuration
├── schema.prisma        # Schéma de base de données
├── pyproject.toml       # Configuration du projet et dépendances
├── README.md            # Ce fichier
├── .env                 # Variables d'environnement
├── .env.example         # Exemple de variables d'environnement
├── .gitignore           # Fichiers à ignorer par Git
└── .python-version      # Version Python utilisée
```

## Développement

Pour contribuer au projet :

1. Clonez le repository
2. Installez les dépendances avec `uv sync`
3. Générez le client Prisma avec `uv run prisma generate`
4. Créez la base de données avec `uv run prisma db push`
5. Configurez le fichier `.env`
6. Lancez le serveur de développement
7. Faites vos modifications
8. Testez vos changements

## Technologies utilisées

- **FastAPI** : Framework web moderne et rapide
- **Pydantic** : Validation des données
- **Prisma** : ORM pour la base de données
- **SQLite** : Base de données légère
- **OpenAI** : API pour l'intelligence artificielle
- **JWT** : Authentification par token
- **Uvicorn** : Serveur ASGI
- **uv** : Gestionnaire de paquets Python rapide