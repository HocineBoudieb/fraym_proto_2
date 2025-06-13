#!/usr/bin/env python3
"""
Script de déploiement pour exposer l'API FastAPI via ngrok
"""

import subprocess
import sys
import time
import requests
import json
from pathlib import Path

def check_ngrok_installed():
    """Vérifie si ngrok est installé"""
    try:
        result = subprocess.run(['ngrok', 'version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ ngrok est installé: {result.stdout.strip()}")
            return True
        else:
            print("❌ ngrok n'est pas installé")
            return False
    except FileNotFoundError:
        print("❌ ngrok n'est pas installé")
        return False

def install_ngrok():
    """Instructions pour installer ngrok"""
    print("\n📦 Pour installer ngrok:")
    print("1. Visitez https://ngrok.com/download")
    print("2. Créez un compte gratuit")
    print("3. Téléchargez ngrok pour votre OS")
    print("4. Ajoutez ngrok à votre PATH")
    print("5. Configurez votre authtoken: ngrok config add-authtoken <token>")
    print("\nOu via Homebrew sur macOS:")
    print("brew install ngrok/ngrok/ngrok")

def start_api_server():
    """Démarre le serveur FastAPI"""
    print("🚀 Démarrage du serveur FastAPI...")
    try:
        # Démarrer le serveur en arrière-plan
        process = subprocess.Popen(
            ['uv', 'run', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Attendre que le serveur démarre
        print("⏳ Attente du démarrage du serveur...")
        time.sleep(5)
        
        # Vérifier si le serveur répond
        try:
            response = requests.get('http://localhost:8000/docs', timeout=5)
            if response.status_code == 200:
                print("✅ Serveur FastAPI démarré avec succès")
                return process
            else:
                print(f"❌ Le serveur ne répond pas correctement (status: {response.status_code})")
                process.terminate()
                return None
        except requests.exceptions.RequestException as e:
            print(f"❌ Impossible de se connecter au serveur: {e}")
            process.terminate()
            return None
            
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du serveur: {e}")
        return None

def start_ngrok_tunnel():
    """Démarre le tunnel ngrok"""
    print("🌐 Démarrage du tunnel ngrok...")
    try:
        # Démarrer ngrok en arrière-plan
        process = subprocess.Popen(
            ['ngrok', 'http', '8000', '--log=stdout'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Attendre que ngrok démarre
        time.sleep(3)
        
        # Récupérer l'URL publique via l'API ngrok
        try:
            response = requests.get('http://localhost:4040/api/tunnels', timeout=5)
            if response.status_code == 200:
                tunnels = response.json()['tunnels']
                if tunnels:
                    public_url = tunnels[0]['public_url']
                    print(f"✅ Tunnel ngrok créé avec succès!")
                    print(f"🔗 URL publique: {public_url}")
                    print(f"📚 Documentation API: {public_url}/docs")
                    print(f"🔍 Interface ngrok: http://localhost:4040")
                    return process, public_url
                else:
                    print("❌ Aucun tunnel trouvé")
                    process.terminate()
                    return None, None
            else:
                print(f"❌ Impossible de récupérer les informations du tunnel (status: {response.status_code})")
                process.terminate()
                return None, None
        except requests.exceptions.RequestException as e:
            print(f"❌ Impossible de se connecter à l'API ngrok: {e}")
            process.terminate()
            return None, None
            
    except Exception as e:
        print(f"❌ Erreur lors du démarrage de ngrok: {e}")
        return None, None

def save_deployment_info(public_url):
    """Sauvegarde les informations de déploiement"""
    deployment_info = {
        "api_url": public_url,
        "docs_url": f"{public_url}/docs",
        "ngrok_dashboard": "http://localhost:4040",
        "deployed_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    with open('deployment_info.json', 'w') as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"💾 Informations de déploiement sauvegardées dans deployment_info.json")

def main():
    print("🚀 Déploiement de l'API Rasa Fraym via ngrok")
    print("=" * 50)
    
    # Vérifier si ngrok est installé
    if not check_ngrok_installed():
        install_ngrok()
        sys.exit(1)
    
    # Démarrer le serveur FastAPI
    api_process = start_api_server()
    if not api_process:
        print("❌ Impossible de démarrer le serveur FastAPI")
        sys.exit(1)
    
    try:
        # Démarrer le tunnel ngrok
        ngrok_process, public_url = start_ngrok_tunnel()
        if not ngrok_process or not public_url:
            print("❌ Impossible de créer le tunnel ngrok")
            api_process.terminate()
            sys.exit(1)
        
        # Sauvegarder les informations de déploiement
        save_deployment_info(public_url)
        
        print("\n" + "=" * 50)
        print("🎉 Déploiement réussi!")
        print(f"🔗 Votre API est accessible à: {public_url}")
        print(f"📚 Documentation: {public_url}/docs")
        print("\n⚠️  Gardez ce terminal ouvert pour maintenir le tunnel actif")
        print("⚠️  Appuyez sur Ctrl+C pour arrêter le déploiement")
        print("=" * 50)
        
        # Attendre l'interruption
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Arrêt du déploiement...")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
    finally:
        # Nettoyer les processus
        if 'api_process' in locals():
            api_process.terminate()
            print("✅ Serveur FastAPI arrêté")
        if 'ngrok_process' in locals() and ngrok_process:
            ngrok_process.terminate()
            print("✅ Tunnel ngrok fermé")

if __name__ == "__main__":
    main()