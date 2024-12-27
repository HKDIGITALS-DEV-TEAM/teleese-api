# Étape 1 : Build - Utiliser une image Node.js pour construire l'application
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Installer les dépendances de production et de développement
RUN npm install

# Copier tous les fichiers nécessaires pour la compilation
COPY tsconfig.json ./
COPY src ./src

# Compiler le code TypeScript en JavaScript
RUN npm run build

# Étape 2 : Runtime - Préparer une image minimale pour exécuter l'application
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les dépendances de production pour réduire la taille de l'image
COPY package*.json ./
RUN npm install --production

# Copier les fichiers compilés depuis l'étape de build
COPY --from=builder /app/dist ./dist

# Exposer le port de l'application (remplacez 3000 par votre port si nécessaire)
EXPOSE 5000

# Définir la commande par défaut pour démarrer l'application
CMD ["node", "dist/index.js"]
