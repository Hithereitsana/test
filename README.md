# Test Technique

## Objectif

Afficher une liste de produits avec filtres par facettes (faceted search).

## Stack

- **Frontend** : VIKE + Vue 3 + TypeScript
- **Backend** : Fastify + TypeScript
- **Base de données** : MongoDB 8
- **Infrastructure** : Docker Compose

## Prérequis

- Docker & Docker Compose
- Node.js 22

## Objectifs

### Backend

Mettre à jour l'endpoint `GET /api/products` pour retourner des données conformes à `frontend/src/types/ProductsResponse` :

```typescript
export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
  facets: Facets;
}
```

**Modèle Product** :
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  brand: String,
  price: Number,
  inStock: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Frontend

- Appliquer des filtres en respectant les web standards
- Organiser des composants minimalistes
- Interface fonctionnelle et élégante

## Démarrage

```bash
docker-compose build
docker-compose up -d
```

- Backend : `http://localhost:3000`
- Frontend : `http://localhost:5173`
- MongoDB : `mongodb://localhost:27018`
- Livesync frontend : `npm run dev` (dans `frontend/`)

## Critères d'évaluation

- Architecture et organisation du code
- Qualité du code
- Performance (pagination, indexation MongoDB)
- Système de facettes (compteurs, mise à jour réactive)
- UX/UI

## Livrable

Le projet sera testé uniquement via `docker compose`. Veillez aux indexes MongoDB.
