# Instructions de démarrage

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


