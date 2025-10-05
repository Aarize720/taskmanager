# Guide d'Installation Complet - Ubuntu

Ce guide vous accompagne pas à pas pour installer et déployer l'application TaskManager sur un serveur Ubuntu (20.04, 22.04 ou 24.04).

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation des Dépendances](#installation-des-dépendances)
3. [Installation avec Docker (Recommandé)](#installation-avec-docker-recommandé)
4. [Installation Manuelle (Sans Docker)](#installation-manuelle-sans-docker)
5. [Configuration Nginx comme Reverse Proxy](#configuration-nginx-comme-reverse-proxy)
6. [Configuration SSL avec Let's Encrypt](#configuration-ssl-avec-lets-encrypt)
7. [Configuration Cloudflare Tunnel](#configuration-cloudflare-tunnel)
8. [Gestion des Services avec Systemd](#gestion-des-services-avec-systemd)
9. [Maintenance et Sauvegarde](#maintenance-et-sauvegarde)
10. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Configuration Serveur Minimale
- **OS**: Ubuntu 20.04 LTS, 22.04 LTS ou 24.04 LTS
- **RAM**: 2 GB minimum (4 GB recommandé)
- **CPU**: 2 cœurs minimum
- **Disque**: 20 GB minimum
- **Accès**: Accès root ou sudo

### Nom de Domaine (Optionnel)
- Un nom de domaine pointant vers votre serveur (pour SSL)
- Ou utilisation de Cloudflare Tunnel

---

## 📦 Installation des Dépendances

### 1. Mise à Jour du Système

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation des Outils de Base

```bash
sudo apt install -y curl wget git vim ufw
```

### 3. Configuration du Pare-feu

```bash
# Autoriser SSH
sudo ufw allow OpenSSH

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le pare-feu
sudo ufw enable
sudo ufw status
```

---

## 🐳 Installation avec Docker (Recommandé)

### 1. Installation de Docker

```bash
# Désinstaller les anciennes versions
sudo apt remove docker docker-engine docker.io containerd runc

# Installer les dépendances
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Ajouter la clé GPG officielle de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Ajouter le dépôt Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier l'installation
sudo docker --version
sudo docker compose version
```

### 2. Configuration de Docker (Optionnel)

```bash
# Ajouter votre utilisateur au groupe docker (pour éviter sudo)
sudo usermod -aG docker $USER

# Appliquer les changements (ou se déconnecter/reconnecter)
newgrp docker

# Tester sans sudo
docker run hello-world
```

### 3. Cloner le Projet

```bash
# Créer un répertoire pour l'application
sudo mkdir -p /opt/taskmanager
sudo chown $USER:$USER /opt/taskmanager

# Cloner le dépôt
cd /opt/taskmanager
git clone <votre-repo-url> .

# Ou télécharger et extraire l'archive
# wget <url-archive>
# tar -xzf taskmanager.tar.gz
```

### 4. Configuration de l'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Configuration `.env` pour Production:**

```env
# Database Configuration
DB_USER=taskmanager
DB_PASSWORD=VotreMotDePasseSecurise123!
DB_NAME=taskmanager_db
DB_PORT=5432

# Backend Configuration
BACKEND_PORT=5000
JWT_SECRET=votre-cle-jwt-super-secrete-minimum-32-caracteres-aleatoires
JWT_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:5000/api

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=noreply@taskmanager.com

# Frontend URL (pour les emails)
FRONTEND_URL=https://votre-domaine.com
```

**⚠️ Important**: 
- Changez `DB_PASSWORD` avec un mot de passe fort
- Générez un `JWT_SECRET` aléatoire de 32+ caractères
- Configurez vos identifiants SMTP

### 5. Générer un JWT Secret Sécurisé

```bash
# Générer une clé aléatoire de 64 caractères
openssl rand -base64 48
```

Copiez le résultat dans `JWT_SECRET` de votre fichier `.env`.

### 6. Construire et Démarrer les Conteneurs

```bash
# Construire les images
docker compose build

# Démarrer les services
docker compose up -d

# Vérifier que tout fonctionne
docker compose ps
docker compose logs -f
```

### 7. Vérifier l'Installation

```bash
# Vérifier les conteneurs en cours d'exécution
docker compose ps

# Vérifier les logs
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Tester l'API
curl http://localhost:5000/api/health

# Tester le frontend
curl http://localhost:3000
```

### 8. Accéder à l'Application

Ouvrez votre navigateur et accédez à:
- **Frontend**: `http://votre-ip-serveur:3000`
- **Backend API**: `http://votre-ip-serveur:5000/api`

---

## 🔨 Installation Manuelle (Sans Docker)

### 1. Installation de Node.js

```bash
# Installer Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### 2. Installation de PostgreSQL

```bash
# Installer PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier le statut
sudo systemctl status postgresql
```

### 3. Configuration de la Base de Données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL, exécuter:
CREATE DATABASE taskmanager_db;
CREATE USER taskmanager WITH ENCRYPTED PASSWORD 'VotreMotDePasseSecurise123!';
GRANT ALL PRIVILEGES ON DATABASE taskmanager_db TO taskmanager;
\q
```

### 4. Cloner et Configurer le Projet

```bash
# Créer le répertoire
sudo mkdir -p /opt/taskmanager
sudo chown $USER:$USER /opt/taskmanager

# Cloner le projet
cd /opt/taskmanager
git clone <votre-repo-url> .

# Copier et configurer .env
cp .env.example .env
nano .env
```

**Configuration `.env` pour installation manuelle:**

```env
# Database Configuration
DB_USER=taskmanager
DB_PASSWORD=VotreMotDePasseSecurise123!
DB_NAME=taskmanager_db
DB_PORT=5432
DB_HOST=localhost

# Backend Configuration
BACKEND_PORT=5000
JWT_SECRET=votre-cle-jwt-super-secrete-minimum-32-caracteres
JWT_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:5000/api

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=noreply@taskmanager.com

# Frontend URL
FRONTEND_URL=https://votre-domaine.com
```

### 5. Installation et Build du Backend

```bash
cd /opt/taskmanager/backend

# Installer les dépendances
npm install

# Compiler TypeScript
npm run build

# Exécuter les migrations
npm run migrate

# Tester le backend
npm start
```

### 6. Installation et Build du Frontend

```bash
# Ouvrir un nouveau terminal
cd /opt/taskmanager/frontend

# Installer les dépendances
npm install

# Build pour production
npm run build
```

### 7. Installation de Nginx pour Servir le Frontend

```bash
# Installer Nginx
sudo apt install -y nginx

# Copier les fichiers build
sudo mkdir -p /var/www/taskmanager
sudo cp -r /opt/taskmanager/frontend/dist/* /var/www/taskmanager/

# Configurer Nginx
sudo nano /etc/nginx/sites-available/taskmanager
```

**Configuration Nginx (`/etc/nginx/sites-available/taskmanager`):**

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        root /var/www/taskmanager;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## 🌐 Configuration Nginx comme Reverse Proxy

### Configuration Avancée avec Nginx

```bash
sudo nano /etc/nginx/sites-available/taskmanager
```

**Configuration complète:**

```nginx
# Limite de taux pour prévenir les abus
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

# Upstream pour le backend
upstream backend {
    server localhost:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Taille maximale des uploads
    client_max_body_size 10M;

    # Logs
    access_log /var/log/nginx/taskmanager_access.log;
    error_log /var/log/nginx/taskmanager_error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Frontend
    location / {
        root /var/www/taskmanager;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache pour les assets statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting pour login
    location /api/auth/login {
        limit_req zone=login_limit burst=3 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        alias /opt/taskmanager/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

```bash
# Tester et recharger
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Configuration SSL avec Let's Encrypt

### 1. Installation de Certbot

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtenir un Certificat SSL

```bash
# Obtenir et installer automatiquement le certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Suivre les instructions interactives
# Entrez votre email
# Acceptez les conditions
# Choisissez de rediriger HTTP vers HTTPS (recommandé)
```

### 3. Renouvellement Automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est configuré via systemd
sudo systemctl status certbot.timer
```

### 4. Vérifier la Configuration SSL

```bash
# Vérifier la configuration Nginx
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

Votre site est maintenant accessible via HTTPS ! 🎉

---

## ☁️ Configuration Cloudflare Tunnel

Alternative à l'exposition directe du serveur avec SSL.

### 1. Installation de Cloudflared

```bash
# Télécharger cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Installer
sudo dpkg -i cloudflared-linux-amd64.deb

# Vérifier l'installation
cloudflared --version
```

### 2. Authentification avec Cloudflare

```bash
# Se connecter à Cloudflare
cloudflared tunnel login
```

Cela ouvrira un navigateur pour vous authentifier.

### 3. Créer un Tunnel

```bash
# Créer un tunnel
cloudflared tunnel create taskmanager

# Noter l'ID du tunnel et le chemin du fichier credentials
```

### 4. Configuration du Tunnel

```bash
# Créer le fichier de configuration
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

**Configuration (`/etc/cloudflared/config.yml`):**

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: taskmanager.votre-domaine.com
    service: http://localhost:3000
  - hostname: api.taskmanager.votre-domaine.com
    service: http://localhost:5000
  - service: http_status:404
```

### 5. Router le DNS

```bash
# Créer les enregistrements DNS
cloudflared tunnel route dns taskmanager taskmanager.votre-domaine.com
cloudflared tunnel route dns taskmanager api.taskmanager.votre-domaine.com
```

### 6. Démarrer le Tunnel comme Service

```bash
# Installer le service
sudo cloudflared service install

# Démarrer le service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Vérifier le statut
sudo systemctl status cloudflared
```

### 7. Mettre à Jour la Configuration

Mettez à jour votre `.env`:

```env
FRONTEND_URL=https://taskmanager.votre-domaine.com
VITE_API_URL=https://api.taskmanager.votre-domaine.com/api
```

Redémarrez les services:

```bash
docker compose down
docker compose up -d
```

---

## ⚙️ Gestion des Services avec Systemd

Pour l'installation manuelle, créez des services systemd.

### 1. Service Backend

```bash
sudo nano /etc/systemd/system/taskmanager-backend.service
```

**Contenu:**

```ini
[Unit]
Description=TaskManager Backend API
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/taskmanager/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /opt/taskmanager/backend/dist/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=taskmanager-backend

[Install]
WantedBy=multi-user.target
```

### 2. Activer et Démarrer le Service

```bash
# Recharger systemd
sudo systemctl daemon-reload

# Activer le service
sudo systemctl enable taskmanager-backend

# Démarrer le service
sudo systemctl start taskmanager-backend

# Vérifier le statut
sudo systemctl status taskmanager-backend

# Voir les logs
sudo journalctl -u taskmanager-backend -f
```

### 3. Commandes Utiles

```bash
# Redémarrer le service
sudo systemctl restart taskmanager-backend

# Arrêter le service
sudo systemctl stop taskmanager-backend

# Voir les logs
sudo journalctl -u taskmanager-backend -n 100 --no-pager
```

---

## 💾 Maintenance et Sauvegarde

### 1. Sauvegarde de la Base de Données

#### Avec Docker:

```bash
# Créer un répertoire pour les sauvegardes
mkdir -p /opt/taskmanager/backups

# Créer une sauvegarde
docker compose exec -T postgres pg_dump -U taskmanager taskmanager_db > /opt/taskmanager/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Compresser la sauvegarde
gzip /opt/taskmanager/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Sans Docker:

```bash
# Créer une sauvegarde
sudo -u postgres pg_dump taskmanager_db > /opt/taskmanager/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Compresser
gzip /opt/taskmanager/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Script de Sauvegarde Automatique

```bash
# Créer le script
sudo nano /opt/taskmanager/backup.sh
```

**Contenu du script:**

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/opt/taskmanager/backups"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le répertoire si nécessaire
mkdir -p $BACKUP_DIR

# Sauvegarde avec Docker
docker compose -f /opt/taskmanager/docker-compose.yml exec -T postgres \
    pg_dump -U taskmanager taskmanager_db | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Supprimer les anciennes sauvegardes
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log
echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
# Rendre le script exécutable
sudo chmod +x /opt/taskmanager/backup.sh

# Tester le script
sudo /opt/taskmanager/backup.sh
```

### 3. Planifier les Sauvegardes avec Cron

```bash
# Éditer crontab
sudo crontab -e

# Ajouter une sauvegarde quotidienne à 2h du matin
0 2 * * * /opt/taskmanager/backup.sh >> /var/log/taskmanager-backup.log 2>&1
```

### 4. Restauration d'une Sauvegarde

#### Avec Docker:

```bash
# Arrêter les services
docker compose down

# Restaurer la base de données
gunzip < /opt/taskmanager/backups/backup_YYYYMMDD_HHMMSS.sql.gz | \
    docker compose exec -T postgres psql -U taskmanager taskmanager_db

# Redémarrer les services
docker compose up -d
```

#### Sans Docker:

```bash
# Arrêter le backend
sudo systemctl stop taskmanager-backend

# Restaurer
gunzip < /opt/taskmanager/backups/backup_YYYYMMDD_HHMMSS.sql.gz | \
    sudo -u postgres psql taskmanager_db

# Redémarrer le backend
sudo systemctl start taskmanager-backend
```

### 5. Mise à Jour de l'Application

#### Avec Docker:

```bash
cd /opt/taskmanager

# Sauvegarder la base de données
./backup.sh

# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer
docker compose down
docker compose build
docker compose up -d

# Vérifier les logs
docker compose logs -f
```

#### Sans Docker:

```bash
cd /opt/taskmanager

# Sauvegarder
./backup.sh

# Récupérer les modifications
git pull

# Backend
cd backend
npm install
npm run build
sudo systemctl restart taskmanager-backend

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/taskmanager/

# Redémarrer Nginx
sudo systemctl reload nginx
```

### 6. Monitoring des Logs

```bash
# Logs Docker
docker compose logs -f
docker compose logs -f backend
docker compose logs -f postgres

# Logs Systemd
sudo journalctl -u taskmanager-backend -f

# Logs Nginx
sudo tail -f /var/log/nginx/taskmanager_access.log
sudo tail -f /var/log/nginx/taskmanager_error.log

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

---

## 🔍 Dépannage

### Problème: Le Backend ne Démarre Pas

**Vérifications:**

```bash
# Vérifier les logs
docker compose logs backend
# ou
sudo journalctl -u taskmanager-backend -n 50

# Vérifier la connexion à PostgreSQL
docker compose exec postgres psql -U taskmanager -d taskmanager_db -c "SELECT 1;"

# Vérifier les variables d'environnement
docker compose exec backend env | grep DB_
```

**Solutions:**
- Vérifier les identifiants de base de données dans `.env`
- S'assurer que PostgreSQL est démarré
- Vérifier que le port 5000 n'est pas déjà utilisé: `sudo lsof -i :5000`

### Problème: Le Frontend ne Peut pas se Connecter au Backend

**Vérifications:**

```bash
# Tester l'API
curl http://localhost:5000/api/health

# Vérifier la configuration CORS
docker compose logs backend | grep CORS
```

**Solutions:**
- Vérifier `VITE_API_URL` dans `.env`
- S'assurer que le backend est accessible
- Vérifier la configuration CORS dans le backend

### Problème: Erreur 502 Bad Gateway avec Nginx

**Vérifications:**

```bash
# Vérifier que le backend fonctionne
curl http://localhost:5000/api/health

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/taskmanager_error.log

# Tester la configuration Nginx
sudo nginx -t
```

**Solutions:**
- Redémarrer le backend
- Vérifier la configuration du proxy dans Nginx
- S'assurer que le port est correct

### Problème: Les Emails ne Sont Pas Envoyés

**Vérifications:**

```bash
# Vérifier les logs du backend
docker compose logs backend | grep -i mail

# Tester la connexion SMTP
telnet smtp.gmail.com 587
```

**Solutions:**
- Vérifier les identifiants SMTP dans `.env`
- Pour Gmail, utiliser un mot de passe d'application
- Vérifier que le port 587 n'est pas bloqué par le pare-feu

### Problème: Erreur de Permission sur les Uploads

**Solutions:**

```bash
# Avec Docker
docker compose exec backend mkdir -p /app/uploads
docker compose exec backend chmod 755 /app/uploads

# Sans Docker
sudo mkdir -p /opt/taskmanager/backend/uploads
sudo chown www-data:www-data /opt/taskmanager/backend/uploads
sudo chmod 755 /opt/taskmanager/backend/uploads
```

### Problème: Base de Données Corrompue

**Solution:**

```bash
# Arrêter les services
docker compose down

# Supprimer le volume
docker volume rm taskmanager_postgres_data

# Restaurer depuis une sauvegarde
docker compose up -d postgres
sleep 10
gunzip < /opt/taskmanager/backups/backup_LATEST.sql.gz | \
    docker compose exec -T postgres psql -U taskmanager taskmanager_db

# Redémarrer tous les services
docker compose up -d
```

### Problème: Utilisation Élevée de la Mémoire

**Solutions:**

```bash
# Limiter la mémoire Docker dans docker-compose.yml
services:
  backend:
    mem_limit: 512m
  postgres:
    mem_limit: 1g

# Redémarrer avec les nouvelles limites
docker compose down
docker compose up -d
```

### Problème: Certificat SSL Expiré

**Solution:**

```bash
# Renouveler manuellement
sudo certbot renew

# Forcer le renouvellement
sudo certbot renew --force-renewal

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## 📊 Monitoring et Performance

### 1. Installation de Monitoring Basique

```bash
# Installer htop pour le monitoring système
sudo apt install -y htop

# Installer ctop pour le monitoring Docker
sudo wget https://github.com/bcicen/ctop/releases/download/v0.7.7/ctop-0.7.7-linux-amd64 -O /usr/local/bin/ctop
sudo chmod +x /usr/local/bin/ctop
```

### 2. Commandes de Monitoring

```bash
# Monitoring système
htop

# Monitoring Docker
ctop

# Utilisation disque
df -h

# Espace utilisé par Docker
docker system df

# Statistiques des conteneurs
docker stats
```

### 3. Nettoyage Docker

```bash
# Nettoyer les images inutilisées
docker image prune -a

# Nettoyer tout (attention!)
docker system prune -a --volumes

# Nettoyer les logs
sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*-json.log"
```

---

## 🎯 Checklist de Sécurité

- [ ] Mot de passe PostgreSQL fort et unique
- [ ] JWT_SECRET aléatoire de 32+ caractères
- [ ] Pare-feu UFW activé et configuré
- [ ] SSL/TLS configuré (Let's Encrypt ou Cloudflare)
- [ ] Sauvegardes automatiques configurées
- [ ] Logs régulièrement vérifiés
- [ ] Mises à jour système régulières (`sudo apt update && sudo apt upgrade`)
- [ ] Rate limiting configuré dans Nginx
- [ ] Headers de sécurité configurés
- [ ] Accès SSH sécurisé (clés SSH, pas de root login)
- [ ] Fail2ban installé et configuré (optionnel)

---

## 📚 Ressources Supplémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---

## 🆘 Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs: `docker compose logs -f`
2. Consultez la section [Dépannage](#dépannage)
3. Vérifiez que toutes les étapes ont été suivies
4. Ouvrez une issue sur le dépôt GitHub

---

## 🎉 Félicitations !

Votre application TaskManager est maintenant installée et opérationnelle sur Ubuntu !

**Prochaines étapes:**
1. Créez votre premier compte utilisateur
2. Configurez les sauvegardes automatiques
3. Configurez le monitoring
4. Personnalisez l'application selon vos besoins

---

**Made with ❤️ for Ubuntu Servers**