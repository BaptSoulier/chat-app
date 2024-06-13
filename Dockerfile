# Utiliser une image de base officielle d'Apache
FROM httpd:2.4

# Installer Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean \

# Copier le fichier de configuration Apache personnalisé
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

# Définir le répertoire de travail pour Node.js
WORKDIR /usr/local/apache2/htdocs/Web

# Copier package.json et package-lock.json pour installer les dépendances
COPY Web/package*.json ./

# Installer les dépendances Node.js
RUN npm install

# Copier le reste des fichiers de l'application
COPY Web/ .

# Exposer le port 80 pour Apache et 3000 pour l'application Node.js
EXPOSE 80
EXPOSE 3000

# Ajouter des commandes pour vérifier l'état des fichiers et démarrer Apache avec verbosité
CMD ["sh", "-c", "httpd-foreground & node server.js"]
