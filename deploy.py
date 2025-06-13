#!/usr/bin/env python3
"""
Script de déploiement complet pour Rasa Fraym
- API via ngrok
- Frontend via GitHub Pages
"""

import subprocess
import sys
import time
import json
import os
from pathlib import Path
import argparse

def run_command(cmd, cwd=None, capture_output=True):
    """Exécute une commande et retourne le résultat"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            cwd=cwd, 
            capture_output=capture_output, 
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_prerequisites():
    """Vérifie les prérequis pour le déploiement"""
    print("🔍 Vérification des prérequis...")
    
    # Vérifier Git
    success, _, _ = run_command("git --version")
    if not success:
        print("❌ Git n'est pas installé")
        return False
    print("✅ Git installé")
    
    # Vérifier uv
    success, _, _ = run_command("uv --version")
    if not success:
        print("❌ uv n'est pas installé")
        return False
    print("✅ uv installé")
    
    # Vérifier pnpm
    success, _, _ = run_command("pnpm --version")
    if not success:
        print("❌ pnpm n'est pas installé")
        return False
    print("✅ pnpm installé")
    
    # Vérifier ngrok
    success, _, _ = run_command("ngrok version")
    if not success:
        print("⚠️  ngrok n'est pas installé (nécessaire pour l'API)")
        print("   Installez-le depuis https://ngrok.com/download")
        return False
    print("✅ ngrok installé")
    
    return True

def setup_environment():
    """Configure l'environnement"""
    print("⚙️  Configuration de l'environnement...")
    
    # Vérifier le fichier .env
    if not Path(".env").exists():
        if Path(".env.example").exists():
            print("📋 Copie de .env.example vers .env")
            success, _, _ = run_command("cp .env.example .env")
            if success:
                print("⚠️  Veuillez configurer le fichier .env avec vos clés API")
                return False
        else:
            print("❌ Fichier .env.example introuvable")
            return False
    
    # Installer les dépendances Python
    print("📦 Installation des dépendances Python...")
    success, _, stderr = run_command("uv sync")
    if not success:
        print(f"❌ Erreur lors de l'installation des dépendances: {stderr}")
        return False
    
    # Générer le client Prisma
    print("🗄️  Génération du client Prisma...")
    success, _, stderr = run_command("uv run prisma generate")
    if not success:
        print(f"❌ Erreur lors de la génération Prisma: {stderr}")
        return False
    
    # Créer la base de données
    print("🗄️  Création de la base de données...")
    success, _, stderr = run_command("uv run prisma db push")
    if not success:
        print(f"❌ Erreur lors de la création de la base: {stderr}")
        return False
    
    # Installer les dépendances frontend
    print("📦 Installation des dépendances frontend...")
    success, _, stderr = run_command("pnpm install", cwd="frontend")
    if not success:
        print(f"❌ Erreur lors de l'installation frontend: {stderr}")
        return False
    
    print("✅ Environnement configuré avec succès")
    return True

def deploy_api():
    """Déploie l'API via ngrok"""
    print("\n🚀 Déploiement de l'API via ngrok...")
    print("=" * 40)
    
    # Lancer le script de déploiement ngrok
    try:
        subprocess.run(["python3", "deploy_ngrok.py"])
    except KeyboardInterrupt:
        print("\n🛑 Déploiement API interrompu")
    except Exception as e:
        print(f"❌ Erreur lors du déploiement API: {e}")

def deploy_frontend():
    """Déploie le frontend sur GitHub Pages"""
    print("\n🌐 Déploiement du frontend sur GitHub Pages...")
    print("=" * 40)
    
    # Vérifier si on est dans un repo Git
    success, _, _ = run_command("git rev-parse --git-dir")
    if not success:
        print("❌ Ce n'est pas un repository Git")
        return False
    
    # Vérifier si on a un remote origin
    success, stdout, _ = run_command("git remote get-url origin")
    if not success:
        print("❌ Aucun remote 'origin' configuré")
        print("   Configurez votre repository GitHub d'abord:")
        print("   git remote add origin https://github.com/username/rasa_fraym.git")
        return False
    
    repo_url = stdout.strip()
    print(f"📍 Repository: {repo_url}")
    
    # Build du frontend
    print("🔨 Build du frontend...")
    success, _, stderr = run_command("pnpm run build", cwd="frontend")
    if not success:
        print(f"❌ Erreur lors du build: {stderr}")
        return False
    
    # Commit et push des changements
    print("📤 Commit et push des changements...")
    run_command("git add .")
    run_command('git commit -m "Deploy: Update frontend and API deployment scripts"')
    success, _, stderr = run_command("git push origin main")
    if not success:
        print(f"⚠️  Erreur lors du push: {stderr}")
        print("   Vérifiez vos permissions GitHub")
    
    print("\n✅ Frontend déployé!")
    print("📋 Étapes suivantes:")
    print("1. Allez sur votre repository GitHub")
    print("2. Settings > Pages")
    print("3. Source: GitHub Actions")
    print("4. Le workflow se déclenchera automatiquement")
    
    # Extraire le nom du repo pour l'URL
    if "github.com" in repo_url:
        repo_parts = repo_url.replace(".git", "").split("/")
        if len(repo_parts) >= 2:
            username = repo_parts[-2]
            repo_name = repo_parts[-1]
            pages_url = f"https://{username}.github.io/{repo_name}/"
            print(f"🔗 URL prévue: {pages_url}")
    
    return True

def show_deployment_summary():
    """Affiche un résumé du déploiement"""
    print("\n" + "=" * 60)
    print("📋 RÉSUMÉ DU DÉPLOIEMENT")
    print("=" * 60)
    
    # Informations API
    if Path("deployment_info.json").exists():
        with open("deployment_info.json", "r") as f:
            info = json.load(f)
        print("🔧 API (ngrok):")
        print(f"   URL: {info['api_url']}")
        print(f"   Docs: {info['docs_url']}")
        print(f"   Dashboard: {info['ngrok_dashboard']}")
    else:
        print("🔧 API: Non déployée")
    
    print("\n🌐 Frontend (GitHub Pages):")
    print("   Status: Configuré pour déploiement automatique")
    print("   Workflow: .github/workflows/deploy-frontend.yml")
    
    print("\n📝 Notes importantes:")
    print("   • L'API ngrok nécessite que le terminal reste ouvert")
    print("   • Le frontend se déploie automatiquement sur push")
    print("   • Configurez GitHub Pages dans les settings du repo")
    print("   • Mettez à jour l'URL de l'API dans le frontend si nécessaire")

def main():
    parser = argparse.ArgumentParser(description="Déploiement Rasa Fraym")
    parser.add_argument("--api-only", action="store_true", help="Déployer seulement l'API")
    parser.add_argument("--frontend-only", action="store_true", help="Déployer seulement le frontend")
    parser.add_argument("--skip-setup", action="store_true", help="Ignorer la configuration")
    
    args = parser.parse_args()
    
    print("🚀 DÉPLOIEMENT RASA FRAYM")
    print("=" * 60)
    
    # Vérifier les prérequis
    if not check_prerequisites():
        print("❌ Prérequis manquants")
        sys.exit(1)
    
    # Configuration de l'environnement
    if not args.skip_setup:
        if not setup_environment():
            print("❌ Erreur lors de la configuration")
            sys.exit(1)
    
    # Déploiement selon les options
    if args.api_only:
        deploy_api()
    elif args.frontend_only:
        deploy_frontend()
    else:
        # Déploiement complet
        print("\n🎯 Déploiement complet sélectionné")
        print("1. API via ngrok")
        print("2. Frontend via GitHub Pages")
        
        choice = input("\nCommencer par (a)pi ou (f)rontend? [a]: ").lower()
        
        if choice == "f":
            deploy_frontend()
            input("\nAppuyez sur Entrée pour déployer l'API...")
            deploy_api()
        else:
            deploy_api()
    
    show_deployment_summary()

if __name__ == "__main__":
    main()