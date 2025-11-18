# Instructions de démarrage

## Installation de Docker et Docker Compose

### macOS

**Option 1 : Docker Desktop (recommandé)**

1. Téléchargez Docker Desktop depuis : https://www.docker.com/products/docker-desktop/
2. Installez l'application en glissant-déposant dans le dossier Applications
3. Lancez Docker Desktop depuis Applications

**Option 2 : Homebrew**

```bash
# Installer Docker Desktop via Homebrew
brew install --cask docker

# Lancer Docker Desktop
open /Applications/Docker.app
```

Docker Compose est inclus avec Docker Desktop sur macOS.

### Linux

**Ubuntu/Debian**

```bash
# Mettre à jour les paquets
sudo apt-get update

# Installer les dépendances
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Ajouter la clé GPG officielle de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Configurer le dépôt
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine et Docker Compose
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter votre utilisateur au groupe docker (pour éviter d'utiliser sudo)
sudo usermod -aG docker $USER

# Redémarrer la session ou exécuter :
newgrp docker
```

**Autres distributions Linux**

Consultez la documentation officielle : https://docs.docker.com/engine/install/

### Windows

**Docker Desktop (recommandé)**

1. Téléchargez Docker Desktop depuis : https://www.docker.com/products/docker-desktop/
2. Exécutez l'installateur et suivez les instructions
3. Redémarrez votre ordinateur si demandé
4. Lancez Docker Desktop depuis le menu Démarrer

**Prérequis Windows :**
- Windows 10 64-bit : Pro, Enterprise, ou Education (Build 19041 ou supérieur)
- Windows 11 64-bit : Home ou Pro version 21H2 ou supérieure
- WSL 2 activé (Docker Desktop l'installera automatiquement si nécessaire)

Docker Compose est inclus avec Docker Desktop sur Windows.

### Vérification de l'installation

```bash
# Vérifier que Docker est installé
docker --version

# Vérifier que Docker Compose est installé
docker compose version
# ou (ancienne version)
docker-compose --version
```

## Prérequis

1. **Démarrer Docker Desktop** (ou le daemon Docker)

## Commandes

### 1. Démarrer tous les services

```bash
docker-compose up -d --build
```

Cette commande va :
- Construire les images Docker pour le backend et le frontend
- Démarrer MongoDB 8
- Démarrer le backend Fastify (port 3000)
- Démarrer le frontend VIKE (port 5173)

### 2. Peupler la base de données

```bash
docker-compose --profile seed run --rm seed
```

Cette commande va générer 100 produits de test dans MongoDB.

### 3. Vérifier l'état des services

```bash
docker-compose ps
```

### 4. Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 5. Arrêter les services

```bash
docker-compose down
```

### 6. Arrêter et supprimer les volumes (réinitialiser la base de données)

```bash
docker-compose down -v
```

## URLs

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **MongoDB** : mongodb://localhost:27018

## Test de l'API

```bash
# Health check
curl http://localhost:3000/health

# Liste des produits
curl http://localhost:3000/api/products

# Produits avec filtres
curl "http://localhost:3000/api/products?search=smartphone&category=Électronique&page=1&limit=10"
```


