#!/bin/sh
set -e

# Générer products.json s'il n'existe pas ou s'il contient moins de 1000 produits
# (pour le développement avec volume monté qui peut écraser le fichier généré)
if [ ! -f "scripts/products.json" ]; then
  echo "Generating products.json (file not found)..."
  npm run generate
else
  # Vérifier le nombre de produits dans le fichier (compter les occurrences de "name")
  PRODUCT_COUNT=$(grep -c '"name"' scripts/products.json 2>/dev/null || echo "0")
  if [ "$PRODUCT_COUNT" -lt 1000 ]; then
    echo "Generating products.json (found only $PRODUCT_COUNT products, need at least 1000)..."
    npm run generate
  else
    echo "products.json already exists with $PRODUCT_COUNT products, skipping generation."
  fi
fi

# Exécuter la commande passée en argument
exec "$@"

