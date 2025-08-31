# Protein Data Warehouse 2025

Ein modernes, interaktives Datenwarenhaus für Proteinstrukturdaten mit einer benutzerfreundlichen Web-Oberfläche.

## 🌟 Übersicht

Das Protein Data Warehouse 2025 ist eine vollständige Webanwendung zur Verwaltung und Analyse von Proteinstrukturdaten. Die Anwendung bietet eine intuitive Benutzeroberfläche mit Master-Detail-Ansichten, internationaler Unterstützung (Deutsch/Englisch), Authentifizierung und interaktiven Datenvisualisierungen.

###Hauptfunktionen

- **Master-Detail-Ansicht**: Vollständige CRUD-Operationen für alle Datenmodelle
- **Internationalisierung**: Unterstützung für Deutsch und Englisch
- **Benutzerauthentifizierung**: Registrierung, Login, E-Mail-Bestätigung
- **Globale Suche**: Suche nach PDB-IDs in der gesamten Anwendung
- **Responsive Design**: Optimiert für Desktop und m
obile Geräte
- **Dark/Light Mode**: Anpassbare Benutzeroberfläche
- **Interaktive Visualisierungen**: Wissenschaftliche Plots und Diagramme
- **Beziehungsmanagement**: Verwaltung von Datenbeziehungen zwischen Modellen

##  Technologie-Stack

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

## Systemanforderungen

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
# zuerst das System aktualisieren
sudo apt update && sudo apt upgrade -y

# Node.js und npm installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL installieren
sudo apt install postgresql postgresql-contrib -y

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
CREATE USER dawe_user WITH PASSWORD 'Passwort1234';
GRANT ALL PRIVILEGES ON DATABASE Dawe2Test TO dawe_user;
\q
```

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
JWT_SECRET=JWTSecret123!

# E-Mail-Konfiguration (für Benutzerregistrierung)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=eEmail@example.com
EMAIL_PASS=AppPasswort
EMAIL_FROM=Email@example.com

# Server-Konfiguration
PORT=5000
NODE_ENV=development
```

### 5. Datenbank initialisieren

```bash
# Zurück zum Hauptverzeichnis
cd ..

# CIF-Dateien laden
node backend/loadData.js

# Oder Datenbank-Schema erstellen
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

Die Anwendung ist local verfügbar unter:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API-Dokumentation**: http://localhost:5000/health

## Verwendung unser dataWarehouse

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

```

#### 2. PostgreSQL-Verbindungsfehler
```bash
# PostgreSQL-Status prüfen
sudo systemctl status postgresql

# PostgreSQL neu starten
sudo systemctl restart postgresql
```



#### 4. Abhängigkeitsprobleme
```bash
# Node-Module löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Logs überprüfen

```bash


# Frontend-Logs (Browser-Entwicklertools)
# Öffnen Sie F12 im Browser und prüfen Sie die Konsole
```


### Produktionsumgebung

```bash

# Anwendung in Produktion starten
pm2 start backend/server.js --name "dawe-backend"
pm2 start "npm start" --name "dawe-frontend" --cwd ./dawe


```


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

