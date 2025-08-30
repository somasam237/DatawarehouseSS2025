# Protein Data Warehouse 2025

Ein modernes, interaktives Datenwarenhaus für Proteinstrukturdaten mit einer benutzerfreundlichen Web-Oberfläche.

## 🌟 Übersicht

Das Protein Data Warehouse 2025 ist eine vollständige Webanwendung zur Verwaltung und Analyse von Proteinstrukturdaten. Die Anwendung bietet eine intuitive Benutzeroberfläche mit Master-Detail-Ansichten, internationaler Unterstützung (Deutsch/Englisch), Authentifizierung und interaktiven Datenvisualisierungen.

### 🚀 Hauptfunktionen

- **📊 Master-Detail-Ansicht**: Vollständige CRUD-Operationen für alle Datenmodelle
- **🌍 Internationalisierung**: Unterstützung für Deutsch und Englisch
- **🔐 Benutzerauthentifizierung**: Registrierung, Login, E-Mail-Bestätigung
- **🔍 Globale Suche**: Schnelle Suche nach PDB-IDs in der gesamten Anwendung
- **📱 Responsive Design**: Optimiert für Desktop und mobile Geräte
- **🌙 Dark/Light Mode**: Anpassbare Benutzeroberfläche
- **📈 Interaktive Visualisierungen**: Wissenschaftliche Plots und Diagramme
- **🔗 Beziehungsmanagement**: Verwaltung von Datenbeziehungen zwischen Modellen

## 🛠️ Technologie-Stack

### Frontend
- **React 19.1.0** - Moderne JavaScript-Bibliothek für Benutzeroberflächen
- **Material-UI (MUI) 7.1.2** - Komponenten-Bibliothek für konsistentes Design
- **React Router 7.6.2** - Client-seitiges Routing
- **Axios 1.10.0** - HTTP-Client für API-Kommunikation
- **React i18next 15.5.3** - Internationalisierung
- **Plotly.js 3.0.1** - Interaktive Datenvisualisierung

### Backend
- **Node.js** - JavaScript-Laufzeitumgebung
- **Express.js 5.1.0** - Web-Framework
- **PostgreSQL** - Relationale Datenbank
- **bcrypt 6.0.0** - Passwort-Hashing
- **JSON Web Tokens** - Authentifizierung
- **Nodemailer 7.0.3** - E-Mail-Versand

## 📋 Systemanforderungen

### Mindestanforderungen
- **Betriebssystem**: Ubuntu 20.04 LTS oder neuer
- **RAM**: 4 GB (8 GB empfohlen)
- **Speicherplatz**: 2 GB freier Speicher
- **Node.js**: Version 18.0.0 oder neuer
- **PostgreSQL**: Version 12 oder neuer

### Empfohlene Konfiguration
- **Betriebssystem**: Ubuntu 22.04 LTS
- **RAM**: 8 GB oder mehr
- **Speicherplatz**: 5 GB freier Speicher
- **Node.js**: Version 20.0.0 oder neuer
- **PostgreSQL**: Version 15 oder neuer

## 🚀 Installation und Setup

### 1. Systemvorbereitung

Aktualisieren Sie Ihr System und installieren Sie die notwendigen Pakete:

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Node.js und npm installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL installieren
sudo apt install postgresql postgresql-contrib -y

# Git installieren (falls noch nicht vorhanden)
sudo apt install git -y

# Build-Tools installieren
sudo apt install build-essential -y
```

### 2. PostgreSQL-Konfiguration

```bash
# PostgreSQL-Service starten
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Als PostgreSQL-Benutzer anmelden
sudo -u postgres psql

# Datenbank und Benutzer erstellen
CREATE DATABASE Dawe2Test;
CREATE USER dawe_user WITH PASSWORD 'IhrSicheresPasswort123!';
GRANT ALL PRIVILEGES ON DATABASE Dawe2Test TO dawe_user;
\q
```

### 3. Projekt klonen und einrichten

```bash
# Projekt klonen
git clone https://github.com/IhrUsername/DataWarehouse2025.git
cd DataWarehouse2025

# Backend-Abhängigkeiten installieren
cd backend
npm install

# Frontend-Abhängigkeiten installieren
cd ../dawe
npm install
```

### 4. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env`-Datei im Backend-Verzeichnis:

```bash
cd ../backend
nano .env
```

Fügen Sie folgende Konfiguration hinzu:

```env
# Datenbank-Konfiguration
DB_USER=dawe_user
DB_PASSWORD=IhrSicheresPasswort123!
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Dawe2Test

# JWT-Konfiguration
JWT_SECRET=IhrSuperGeheimesJWTSecret123!

# E-Mail-Konfiguration (für Benutzerregistrierung)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=IhreEmail@gmail.com
EMAIL_PASS=IhrAppPasswort
EMAIL_FROM=IhreEmail@gmail.com

# Server-Konfiguration
PORT=5000
NODE_ENV=development
```

### 5. Datenbank initialisieren

```bash
# Zurück zum Hauptverzeichnis
cd ..

# CIF-Dateien laden (falls vorhanden)
node backend/loadData.js

# Oder Datenbank-Schema erstellen (falls loadData.js nicht verfügbar)
psql -U dawe_user -d Dawe2Test -f backend/database/schema.sql
```

### 6. Anwendung starten

#### Backend starten:
```bash
cd backend
node server.js
```

#### Frontend starten (in einem neuen Terminal):
```bash
cd dawe
npm start
```

Die Anwendung ist jetzt verfügbar unter:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API-Dokumentation**: http://localhost:5000/health

## 📖 Verwendung

### 1. Erste Schritte

1. **Registrierung**: Erstellen Sie ein neues Benutzerkonto über die Registrierungsseite
2. **E-Mail-Bestätigung**: Bestätigen Sie Ihre E-Mail-Adresse
3. **Anmeldung**: Melden Sie sich mit Ihren Zugangsdaten an

### 2. Navigation

- **Startseite**: Übersicht über alle verfügbaren Datenmodelle
- **Protein Information**: Verwaltung von Proteinstrukturdaten
- **Experimental Data**: Experimentelle Daten und Methoden
- **Ligands**: Liganden-Informationen
- **Macromolecules**: Makromolekül-Daten
- **Authors & Funding**: Autoren- und Finanzierungsinformationen
- **Software Used**: Verwendete Software
- **Version History**: Versionsverlauf

### 3. Master-Detail-Ansicht

Jedes Datenmodell bietet eine Master-Detail-Ansicht mit:
- **Master-Ansicht**: Tabelle mit Paginierung, Suche und CRUD-Operationen
- **Detail-Ansicht**: Detaillierte Informationen zu einzelnen Einträgen
- **Beziehungsverwaltung**: Verwaltung von Datenbeziehungen

### 4. Globale Suche

Verwenden Sie die Suchleiste in der Navigation, um schnell nach PDB-IDs zu suchen.

### 5. Internationalisierung

Wechseln Sie zwischen Deutsch und Englisch über das Sprachauswahl-Menü.

## 🔧 Entwicklung

### Projektstruktur

```
DataWarehouse2025/
├── backend/                 # Backend-Server
│   ├── controllers/         # Controller-Logik
│   ├── models/             # Datenmodelle
│   ├── routes/             # API-Routen
│   ├── database/           # Datenbank-Skripte
│   ├── server.js           # Hauptserver-Datei
│   └── package.json        # Backend-Abhängigkeiten
├── dawe/                   # Frontend-React-App
│   ├── src/
│   │   ├── components/     # React-Komponenten
│   │   ├── pages/          # Seiten-Komponenten
│   │   ├── services/       # API-Services
│   │   └── theme.js        # Theme-Konfiguration
│   └── package.json        # Frontend-Abhängigkeiten
└── data/                   # CIF-Dateien und Daten
```

### Entwicklungsserver starten

```bash
# Backend im Entwicklungsmodus
cd backend
npm run dev  # Falls verfügbar, sonst: node server.js

# Frontend im Entwicklungsmodus
cd dawe
npm start
```

### Tests ausführen

```bash
# Frontend-Tests
cd dawe
npm test

# Backend-Tests (falls verfügbar)
cd backend
npm test
```

## 🐛 Fehlerbehebung

### Häufige Probleme

#### 1. Port bereits in Verwendung
```bash
# Port 3000 freigeben
sudo lsof -ti:3000 | xargs kill -9

# Port 5000 freigeben
sudo lsof -ti:5000 | xargs kill -9
```

#### 2. PostgreSQL-Verbindungsfehler
```bash
# PostgreSQL-Status prüfen
sudo systemctl status postgresql

# PostgreSQL neu starten
sudo systemctl restart postgresql
```

#### 3. Node.js-Versionsprobleme
```bash
# Node.js-Version prüfen
node --version

# NVM verwenden für Version-Management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### 4. Abhängigkeitsprobleme
```bash
# Node-Module löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Logs überprüfen

```bash
# Backend-Logs
cd backend
tail -f logs/app.log  # Falls verfügbar

# Frontend-Logs (Browser-Entwicklertools)
# Öffnen Sie F12 im Browser und prüfen Sie die Konsole
```

## 🔒 Sicherheit

### Empfohlene Sicherheitsmaßnahmen

1. **Starke Passwörter**: Verwenden Sie komplexe Passwörter für alle Benutzerkonten
2. **HTTPS**: Konfigurieren Sie SSL/TLS für Produktionsumgebungen
3. **Firewall**: Beschränken Sie den Zugriff auf notwendige Ports
4. **Regelmäßige Updates**: Halten Sie alle Abhängigkeiten aktuell
5. **Backup-Strategie**: Implementieren Sie regelmäßige Datenbank-Backups

### Produktionsumgebung

```bash
# PM2 für Prozess-Management installieren
npm install -g pm2

# Anwendung in Produktion starten
pm2 start backend/server.js --name "dawe-backend"
pm2 start "npm start" --name "dawe-frontend" --cwd ./dawe

# PM2-Status überprüfen
pm2 status
pm2 logs
```

## 📞 Support

### Hilfe erhalten

1. **Dokumentation**: Prüfen Sie diese README-Datei
2. **Issues**: Erstellen Sie ein Issue im GitHub-Repository
3. **Community**: Nutzen Sie die Community-Foren

### Nützliche Befehle

```bash
# System-Informationen
uname -a
node --version
npm --version
psql --version

# Prozess-Status
ps aux | grep node
ps aux | grep postgres

# Netzwerk-Verbindungen
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
```

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe LICENSE-Datei für Details.

## 🤝 Beitragen

Wir freuen uns über Beiträge! Bitte lesen Sie unsere Contributing-Richtlinien.

### Entwicklungsumgebung einrichten

```bash
# Fork des Repositories erstellen
git clone https://github.com/IhrUsername/DataWarehouse2025.git
cd DataWarehouse2025

# Feature-Branch erstellen
git checkout -b feature/neue-funktion

# Änderungen committen
git add .
git commit -m "Neue Funktion hinzugefügt"

# Pull Request erstellen
git push origin feature/neue-funktion
```

---

**Entwickelt mit ❤️ für die wissenschaftliche Community**

*Letzte Aktualisierung: August 2025* 