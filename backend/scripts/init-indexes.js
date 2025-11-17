// Script d'initialisation MongoDB pour créer les index
db = db.getSiblingDB('products_db');

// Créer l'index textuel pour la recherche
db.products.createIndex({
  name: 'text',
  description: 'text'
});

print('Indexes created successfully');

