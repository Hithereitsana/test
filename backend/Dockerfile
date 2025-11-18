FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copier les scripts nécessaires pour la génération
COPY scripts/ ./scripts/

# Générer les produits lors du build
RUN npm run generate

# Copier le reste du code
COPY . .

# S'assurer que le script d'entrypoint a les bonnes permissions
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

