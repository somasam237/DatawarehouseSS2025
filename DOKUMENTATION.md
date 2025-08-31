Technische Dokumentation

## Inhaltsverzeichnis

1. [Architektur-Übersicht](#architektur-übersicht)
2. [Datenbank-Schema](#datenbank-schema)
3. [API-Dokumentation](#api-dokumentation)
4. [Frontend-Architektur](#frontend-architektur)
5. [Authentifizierung](#authentifizierung)
6. [Internationalisierung](#internationalisierung)
7. [Entwicklungsrichtlinien](#entwicklungsrichtlinien)
8. [Deployment](#deployment)

## 🏗️ Architektur-Übersicht

### Systemarchitektur

```

   Frontend          │    Backend      │    │   PostgreSQL    │
   (React)       ◄──►│   (Node.js)     │◄──►│   Database      │
   Port: 3000        │   Port: 5000    │    │   Port: 5432    │
 
```

### Technologie-Stack

#### Frontend (React)
- **Framework**: React 19.1.0 mit Hooks
- **UI-Bibliothek**: Material-UI (MUI) 7.1.2
- **Routing**: React Router 7.6.2
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP-Client**: Axios 1.10.0
- **Internationalisierung**: React i18next 15.5.3
- **Visualisierung**: Plotly.js 3.0.1

#### Backend (Node.js)
- **Framework**: Express.js 5.1.0
- **Datenbank**: PostgreSQL mit pg-Bibliothek
- **Authentifizierung**: JWT (jsonwebtoken)
- **Passwort-Hashing**: bcrypt 6.0.0
- **E-Mail**: Nodemailer 7.0.3
- **Umgebungsvariablen**: dotenv 16.5.0
- **CORS**: cors 2.8.5

## 🗄️ Datenbank-Schema

### Tabellen-Übersicht

```sql
-- Benutzer-Tabelle
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Protein-Informationen
CREATE TABLE protein_info (
    pdb_id VARCHAR(10) PRIMARY KEY,
    title TEXT,
    deposition_date DATE,
    release_date DATE,
    resolution DECIMAL(5,2),
    r_factor DECIMAL(5,3),
    r_free DECIMAL(5,3),
    experimental_method VARCHAR(100),
    space_group VARCHAR(50),
    unit_cell_a DECIMAL(10,3),
    unit_cell_b DECIMAL(10,3),
    unit_cell_c DECIMAL(10,3),
    unit_cell_alpha DECIMAL(5,2),
    unit_cell_beta DECIMAL(5,2),
    unit_cell_gamma DECIMAL(5,2),
    molecular_weight DECIMAL(10,2),
    sequence_length INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experimental_data (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    experimental_method VARCHAR(100),
    resolution DECIMAL(5,2),
    r_factor DECIMAL(5,3),
    r_free DECIMAL(5,3),
    temperature DECIMAL(5,2),
    ph DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ligands (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    ligand_name VARCHAR(100),
    ligand_id VARCHAR(20),
    chemical_formula VARCHAR(100),
    molecular_weight DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE macromolecules (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    molecule_name VARCHAR(100),
    molecule_type VARCHAR(50),
    chain_id VARCHAR(10),
    sequence_length INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors_funding (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    author_names TEXT,
    funding_org VARCHAR(200),
    funding_location VARCHAR(100),
    grant_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE software_used (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    software_name VARCHAR(100),
    software_purpose VARCHAR(200),
    software_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE version_history (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    version_number VARCHAR(20),
    release_date DATE,
    changes_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Beziehungen


## 🔌 API-Dokumentation

URL
```
http://localhost:5000/api
```

### The Authentifizierung

#### The Registrierung
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "user",
    "email": "user@example.com",
    "password": "Passwort123'!"
}
```

#### Die Anmeldung von user (log in)
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "Passwort123!"
}
```

#### E-Mail-Bestätigung
```http
GET /api/auth/verify/:token
```

### Protein-Informationen

#### Alle Proteine abrufen
```http
GET /api/protein-info?page=1&limit=10&search=1DP5
Authorization: Bearer <JWT_TOKEN>
```

#### Einzelnes Protein abrufen
```http
GET /api/protein-info/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

#### Protein erstellen
```http
POST /api/protein-info
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "pdb_id": "1DP5",
    "title": "Protein Structure",
    "resolution": 2.5,
    "experimental_method": "X-RAY DIFFRACTION"
}
```

#### Protein aktualisieren
```http
PUT /api/protein-info/:pdbId
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "title": "Updated Protein Structure",
    "resolution": 2.0
}
```

#### Protein löschen
```http
DELETE /api/protein-info/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

#### Statistiken abrufen
```http
GET /api/protein-info/statistics
Authorization: Bearer <JWT_TOKEN>
```

### Experimentelle Daten

#### Alle experimentellen Daten abrufen
```http
GET /api/experimental-data?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Experimentelle Daten nach PDB-ID
```http
GET /api/experimental-data/pdb/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

### Liganden

#### Alle Liganden abrufen
```http
GET /api/ligands?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Liganden nach PDB-ID
```http
GET /api/ligands/pdb/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

### Makromoleküle

#### Alle Makromoleküle abrufen
```http
GET /api/macromolecules?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Makromoleküle nach PDB-ID
```http
GET /api/macromolecules/pdb/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

### Autoren und Finanzierung

#### Alle Autoren/Finanzierung abrufen
```http
GET /api/authors-funding?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Autoren/Finanzierung nach PDB-ID
```http
GET /api/authors-funding/pdb/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

### Verwendete Software

#### Alle Software abrufen
```http
GET /api/software-used?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Software nach PDB-ID
```http
GET /api/software-used/pdb/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

### Versionsverlauf

#### Alle Versionen abrufen
```http
GET /api/version-history?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Versionen nach PDB-ID
```http
GET /api/version-history/pdb/:pdbId
Authorization: Bearer <JWT_TOKEN>
```

### Globale Suche

#### Suche in allen Modellen
```http
GET /api/search?q=1DP5&models=protein-info,ligands,macromolecules
Authorization: Bearer <JWT_TOKEN>
```

## 🎨 Frontend-Architektur

### Komponenten-Struktur

```
src/
├── components/
│   ├── Navbar.js              # Hauptnavigation
│   ├── DataTableView.js       # Generische Datentabelle
│   ├── MasterDetailView.js    # Master-Detail-Ansicht
│   ├── GlobalSearch.js        # Globale Suche
│   ├── RecordForm.js          # Generisches Formular
│   ├── RelationshipManager.js # Beziehungsverwaltung
│   └── Footer.js              # Fußzeile
├── pages/
│   ├── Home.js                # Startseite
│   ├── Login.js               # Anmeldung
│   ├── Register.js            # Registrierung
│   ├── ProteinInfoPage.js     # Protein-Informationen
│   ├── PDBDetailPage.js       # PDB-Detailseite
│   └── dPage.js         # Weitere Modell-Seiten
├── services/
│   └── api.js                 # API-Service-Funktionen
├── theme.js                   # Theme-Konfiguration
└── i18n.js                    # Internationalisierung
```

### State Management

#### Context API
```javascript
// Theme Context
const ColorModeContext = createContext();

// Authentication Context
const AuthContext = createContext();

// Language Context
const LanguageContext = createContext();
```

#### Custom Hooks
```javascript
// useAuth - Authentifizierung
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // ...
};

// useApi - API-Kommunikation
const useApi = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // ...
};
```

### Routing

```javascript
// App.js
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/protein-info" element={<ProteinInfoPage />} />
    <Route path="/protein-info/:pdbId" element={<PDBDetailPage />} />
    <Route path="/protein-info-master-detail" element={<ProteinInfoMasterDetail />} />
    {/* Weitere Routen */}
</Routes>
```

## 🔐 Authentifizierung

### JWT-Token-Struktur

```javascript
// Token-Payload
{
    "userId": 123,
    "username": "benutzer",
    "email": "benutzer@example.com",
    "iat": 1640995200,
    "exp": 1641081600
}
```

### Middleware

```javascript
// authMiddleware.js
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token erforderlich' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Ungültiger Token' });
        }
        req.user = user;
        next();
    });
};
```

### Frontend-Authentifizierung

```javascript
// AuthService.js
class AuthService {
    static async login(email, password) {
        const response = await axios.post('/api/auth/login', {
            email,
            password
        });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    }
    
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    
    static getToken() {
        return localStorage.getItem('token');
    }
    
    static isAuthenticated() {
        return !!this.getToken();
    }
}
```

## 🌍 Internationalisierung

### Übersetzungsstruktur

```javascript
// i18n.js
const resources = {
    en: {
        translation: {
            // Englische Übersetzungen
            "ProteinDataWarehouse": "Protein Data Warehouse",
            "Login": "Login",
            "Register": "Register",
            // ...
        }
    },
    de: {
        translation: {
            // Deutsche Übersetzungen
            "ProteinDataWarehouse": "Protein-Datenwarenhaus",
            "Login": "Anmelden",
            "Register": "Registrieren",
            // ...
        }
    }
};
```

### Verwendung in Komponenten

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    
    return (
        <div>
            <h1>{t('ProteinDataWarehouse')}</h1>
            <button onClick={() => changeLanguage('de')}>Deutsch</button>
            <button onClick={() => changeLanguage('en')}>English</button>
        </div>
    );
};
```

## 📝 Entwicklungsrichtlinien

### Code-Stil

#### JavaScript/React
```javascript
// Komponenten-Namen: PascalCase
const MyComponent = () => {
    // Hooks am Anfang
    const [state, setState] = useState(null);
    const { t } = useTranslation();
    
    // Event-Handler: handle + Beschreibung
    const handleClick = () => {
        // Implementation
    };
    
    // JSX mit klarer Struktur
    return (
        <div className="my-component">
            <h1>{t('Title')}</h1>
            <button onClick={handleClick}>
                {t('ClickMe')}
            </button>
        </div>
    );
};
```

#### CSS/Styling
```css
/* BEM-Methodologie */
.my-component {
    /* Basis-Styles */
}

.my-component__title {
    /* Element-Styles */
}

.my-component--active {
    /* Modifier-Styles */
}
```

### Git-Workflow

```bash
# Feature-Branch erstellen
git checkout -b feature/neue-funktion

# Änderungen committen
git add .
git commit -m "feat: Neue Funktion hinzugefügt

- Beschreibung der Änderungen
- Weitere Details"

# Branch pushen
git push origin feature/neue-funktion

# Pull Request erstellen
# Code-Review durchführen
# Merge in main
```

### Commit-Konventionen

```
feat: Neue Funktion
fix: Bug-Fix
docs: Dokumentation
style: Formatierung
refactor: Code-Refactoring
test: Tests
chore: Wartungsarbeiten
```

### Testing

#### Unit Tests
```javascript
// MyComponent.test.js
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
    test('renders title correctly', () => {
        render(<MyComponent />);
        expect(screen.getByText('Title')).toBeInTheDocument();
    });
});
```

#### API Tests
```javascript
// api.test.js
import axios from 'axios';

describe('API Endpoints', () => {
    test('GET /api/protein-info returns data', async () => {
        const response = await axios.get('/api/protein-info');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });
});
```

## 🚀 Deployment

### Produktionsumgebung

#### Environment-Variablen
```env
# Produktions-Konfiguration
NODE_ENV=production
PORT=5000
DB_HOST=production-db-host
DB_PASSWORD=production-password
JWT_SECRET=production-jwt-secret
EMAIL_HOST=smtp.production.com
```

#### PM2-Konfiguration
```javascript
// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'dawe-backend',
            script: 'backend/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'dawe-frontend',
            script: 'npm',
            args: 'start',
            cwd: './dawe',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
```

#### Nginx-Konfiguration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/dawe/build;
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
    }
}
 