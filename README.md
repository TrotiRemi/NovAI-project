# NovAI - Architecture Basique

Architecture complète avec frontend et backend pour le site de NovAI.

## Structure du Projet

```
NovAI-project/
├── frontend/
│   ├── index.html      # Page d'accueil
│   └── styles.css      # Feuille de styles
├── backend/
│   ├── server.js       # Serveur Express
│   └── package.json    # Dépendances Node.js
└── README.md
```

## Prérequis

L'application fonctionne sans clé API OpenAI, mais la partie test ne se comportera pas de manière optimale. Pour une expérience complète, ajoutez votre clé API OpenAI dans le fichier `backend/.env` :

```
OPENAI_API_KEY=sk-votre-clé-ici
```

Le fichier `.env` est déjà présent dans le repository, il vous suffit d'y insérer votre clé de type `sk-****`.

## Installation et Démarrage

### Avec Docker Compose (Recommandé)

1. Assurez-vous que Docker et Docker Compose sont installés

2. Lancez le projet :
```bash
docker-compose up --build
```

Le serveur sera accessible à `http://localhost:5000`

### Sans Docker (Développement Local)

1. Accédez au dossier backend :
```bash
cd backend
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez le serveur :
```bash
npm start
```

Le serveur sera accessible à `http://localhost:5000`

## Fonctionnalités

- **Frontend** : Page d'accueil HTML/CSS avec le message "Bienvenue sur le site de NovAI"
- **Backend** : Serveur Express qui sert le frontend et fournit une API
- **CORS** : Activé pour les requêtes cross-origin

## Routes API

- `GET /` - Page d'accueil
- `GET /api/welcome` - Retourne le message de bienvenue en JSON

---

Pour développer, vous pouvez utiliser `npm run dev` pour activer le rechargement automatique.
