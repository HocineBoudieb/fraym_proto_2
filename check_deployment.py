#!/usr/bin/env python3
"""
Script de vérification pour le déploiement Rasa Fraym
Vérifie que tous les prérequis sont en place
"""

import subprocess
import sys
import os
from pathlib import Path
import json

def check_command(cmd, name):
    """Vérifie si une commande est disponible"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            capture_output=True, 
            text=True
        )
        if result.returncode == 0:
            version = result.stdout.strip().split('\n')[0]
            print(f"✅ {name}: {version}")
            return True
        else:
            print(f"❌ {name}: Non installé")
            return False
    except Exception as e:
        print(f"❌ {name}: Erreur - {e}")
        return False

def check_file(path, name, required=True):
    """Vérifie si un fichier existe"""
    if Path(path).exists():
        print(f"✅ {name}: Trouvé")
        return True
    else:
        status = "❌" if required else "⚠️ "
        print(f"{status} {name}: {'Manquant' if required else 'Optionnel - Non trouvé'}")
        return not required

def check_env_file():
    """Vérifie le fichier .env"""
    if not Path(".env").exists():
        print("❌ Fichier .env: Manquant")
        print("   Copiez .env.example vers .env et configurez-le")
        return False
    
    # Vérifier les variables importantes
    required_vars = [
        'OPENAI_API_KEY',
        'OPENAI_ASSISTANT_ID',
        'SECRET_KEY'
    ]
    
    missing_vars = []
    with open('.env', 'r') as f:
        content = f.read()
        for var in required_vars:
            if f"{var}=" not in content or f"{var}=your_" in content:
                missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Variables .env à configurer: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ Fichier .env: Configuré")
        return True

def check_git_repo():
    """Vérifie la configuration Git"""
    if not Path(".git").exists():
        print("❌ Repository Git: Non initialisé")
        print("   Exécutez: git init")
        return False
    
    # Vérifier le remote origin
    try:
        result = subprocess.run(
            "git remote get-url origin",
            shell=True,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            origin = result.stdout.strip()
            print(f"✅ Git remote origin: {origin}")
            return True
        else:
            print("⚠️  Git remote origin: Non configuré")
            print("   Configurez avec: git remote add origin <url>")
            return False
    except Exception:
        print("❌ Git remote: Erreur de vérification")
        return False

def check_dependencies():
    """Vérifie les dépendances Python"""
    try:
        result = subprocess.run(
            "uv run python -c 'import fastapi, openai, prisma'",
            shell=True,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("✅ Dépendances Python: Installées")
            return True
        else:
            print("❌ Dépendances Python: Manquantes")
            print("   Exécutez: uv sync")
            return False
    except Exception:
        print("❌ Dépendances Python: Erreur de vérification")
        return False

def check_frontend_deps():
    """Vérifie les dépendances frontend"""
    if not Path("frontend/node_modules").exists():
        print("❌ Dépendances frontend: Non installées")
        print("   Exécutez: cd frontend && pnpm install")
        return False
    else:
        print("✅ Dépendances frontend: Installées")
        return True

def check_database():
    """Vérifie la base de données"""
    try:
        result = subprocess.run(
            "uv run prisma db push --accept-data-loss",
            shell=True,
            capture_output=True,
            text=True
        )
        if "Database is now in sync" in result.stdout or "No changes" in result.stdout or "already in sync" in result.stdout:
            print("✅ Base de données: Synchronisée")
            return True
        else:
            print("❌ Base de données: Problème de synchronisation")
            print(f"   Erreur: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Base de données: Erreur - {e}")
        return False

def check_ports():
    """Vérifie si les ports sont disponibles"""
    import socket
    
    ports_to_check = [8000, 3000, 4040]
    available_ports = []
    
    for port in ports_to_check:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        
        if result != 0:
            available_ports.append(port)
        else:
            print(f"⚠️  Port {port}: Déjà utilisé")
    
    if len(available_ports) == len(ports_to_check):
        print("✅ Ports: Tous disponibles")
        return True
    else:
        print(f"⚠️  Ports disponibles: {available_ports}")
        return False

def generate_deployment_checklist():
    """Génère une checklist de déploiement"""
    checklist = {
        "pre_deployment": [
            "✅ Tous les outils sont installés",
            "✅ Fichier .env configuré",
            "✅ Dépendances installées",
            "✅ Base de données synchronisée",
            "✅ Repository Git configuré"
        ],
        "api_deployment": [
            "🔧 Compte ngrok créé et authtoken configuré",
            "🔧 Variables d'environnement validées",
            "🔧 Test local de l'API réussi"
        ],
        "frontend_deployment": [
            "🔧 Repository GitHub créé",
            "🔧 GitHub Pages activé",
            "🔧 URL de l'API configurée dans le frontend",
            "🔧 Build frontend réussi"
        ],
        "post_deployment": [
            "🔧 Test de l'API publique",
            "🔧 Test du frontend déployé",
            "🔧 Vérification de la communication API ↔ Frontend"
        ]
    }
    
    with open('deployment_checklist.json', 'w') as f:
        json.dump(checklist, f, indent=2, ensure_ascii=False)
    
    print("\n📋 Checklist de déploiement générée: deployment_checklist.json")

def main():
    print("🔍 VÉRIFICATION DU DÉPLOIEMENT RASA FRAYM")
    print("=" * 50)
    
    checks = []
    
    # Vérification des outils
    print("\n🛠️  Outils requis:")
    checks.append(check_command("python3 --version", "Python"))
    checks.append(check_command("uv --version", "uv"))
    checks.append(check_command("node --version", "Node.js"))
    checks.append(check_command("pnpm --version", "pnpm"))
    checks.append(check_command("git --version", "Git"))
    checks.append(check_command("ngrok version", "ngrok"))
    
    # Vérification des fichiers
    print("\n📁 Fichiers de configuration:")
    checks.append(check_file(".env.example", "Fichier .env.example"))
    checks.append(check_env_file())
    checks.append(check_file("pyproject.toml", "Configuration Python"))
    checks.append(check_file("frontend/package.json", "Configuration frontend"))
    checks.append(check_file(".github/workflows/deploy-frontend.yml", "Workflow GitHub"))
    
    # Vérification Git
    print("\n🔗 Configuration Git:")
    checks.append(check_git_repo())
    
    # Vérification des dépendances
    print("\n📦 Dépendances:")
    checks.append(check_dependencies())
    checks.append(check_frontend_deps())
    
    # Vérification de la base de données
    print("\n🗄️  Base de données:")
    checks.append(check_database())
    
    # Vérification des ports
    print("\n🔌 Ports:")
    check_ports()  # Non critique
    
    # Résumé
    print("\n" + "=" * 50)
    passed = sum(checks)
    total = len(checks)
    
    if passed == total:
        print(f"🎉 PRÊT POUR LE DÉPLOIEMENT! ({passed}/{total} vérifications réussies)")
        print("\n🚀 Commandes de déploiement:")
        print("   python3 deploy.py              # Déploiement complet")
        print("   python3 deploy_ngrok.py        # API seulement")
        print("   python3 deploy.py --frontend-only  # Frontend seulement")
    else:
        print(f"⚠️  CONFIGURATION INCOMPLÈTE ({passed}/{total} vérifications réussies)")
        print("\n🔧 Actions requises:")
        print("   1. Corrigez les erreurs ci-dessus")
        print("   2. Relancez ce script")
        print("   3. Procédez au déploiement")
    
    # Générer la checklist
    generate_deployment_checklist()
    
    print("\n📖 Guide complet: DEPLOYMENT.md")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)