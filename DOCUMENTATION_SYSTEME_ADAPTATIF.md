# Documentation: Système Adaptatif d'Orientation NovAI

## Résumé Exécutif

NovAI dispose maintenant d'un système complet et adaptatif pour collecter les informations utilisateur en 3 sections:
1. **Profil** (IAG model): Comprendre la personnalité de l'utilisateur
2. **Goûts**: Identifier les intérêts professionnels et domaines technologiques
3. **Capacités**: Évaluer les compétences techniques et transversales

Chaque conversation est **adaptative** - les questions évoluent en fonction des réponses précédentes.

---

## Architecture Technique

### 1. Backend (Node.js + Express)

#### Endpoints Implémentés

**User Management:**
```
GET /api/user/new              -> Crée un nouvel utilisateur
GET /api/user/:userId          -> Récupère le profil utilisateur
```

**Conversations Adaptatives:**
```
POST /api/chat-profil          -> IA adaptative pour Profil (IAG)
POST /api/chat-gouts           -> IA adaptative pour Goûts
```

#### Flux de Données

```
Client Frontend
    ↓
Envoie message + userId + historique
    ↓
Backend (server.js)
    ↓
Analyse contexte + génère system prompt adaptatif
    ↓
OpenAI API (gpt-3.5-turbo)
    ↓
Récupère réponse de l'IA
    ↓
Stocke dans profileStorage (en mémoire)
    ↓
Retourne réponse au client
```

### 2. Stockage de Profil (profileStorage.js)

Le fichier `backend/services/profileStorage.js` gère:

- **Création** de profils utilisateurs avec structure complète
- **Stockage** de l'historique conversationnel par section
- **Récupération** des données utilisateur
- **Mise à jour** progressive du profil

Structure JSON du profil:
```json
{
  "user_id": "user_123456",
  "profil": {
    "prenom": "...",
    "iad_profile": { "I": "...", "A": "...", "G": "..." },
    "experiences": [],
    ...
  },
  "gouts": {
    "domaines_tech": [],
    "impact_souhaite": "...",
    ...
  },
  "conversation_history": {
    "profil": [ { role: "user|assistant", content: "..." } ],
    "gouts": [ { role: "user|assistant", content: "..." } ],
    ...
  }
}
```

---

## Système Adaptatif Détaillé

### 1. Profil IAG - Questions Adaptatives

**Logique d'Adaptation:**
```
Message utilisateur
    ↓
Analyser historique conversationnel
    ↓
Détecter patterns:
├─ Mots-clés: "équipe", "ensemble" → Extraverti
├─ Mots-clés: "seul", "autonome" → Introverti
├─ Mots-clés: "créat", "imagin" → Créatif
└─ Mots-clés: "logique", "analyser" → Analyste
    ↓
Générer guidance adaptée pour OpenAI
    ↓
IA pose prochaine question ciblée
```

**Exemple de Progression:**
1. "Comment te décrisTu ?" → Réponse: "J'aime créer et innover"
2. *[Système détecte créativité]* → "Tu crées plutôt seul ou avec d'autres ?"
3. *[Détecte autonomie + créativité]* → "Aimes-tu aussi mettre en place concrètement ou juste imaginer ?"

### 2. Goûts - Questions Adaptatives

**Logique d'Adaptation:**
```
Message utilisateur
    ↓
Détecter domaines mentionnés:
├─ ["ia", "intelligence artificielle", "ml", ...]
├─ ["espace", "satellite", "aerospace", ...]
├─ ["cyber", "sécurité", "hacka", ...]
├─ ["frontend", "ui", "design", ...]
└─ ... [7 autres domaines]
    ↓
Détecter valeurs:
├─ "aider" + "impact" + "société" → Impact Social
└─ "innov" + "créer" + "nouveau" → Innovation
    ↓
Générer guidance contextuelle
    ↓
IA adapte les prochaines questions au domaine
```

**Exemple de Progression:**
1. "Quel domaine te fascine ?" → Réponse: "L'espace et les satellites"
2. *[Système détecte "espace"]* → "Que te fascine particulièrement dans l'espace ?"
3. *[Détecte innovation]* → "Veux-tu étudier ou mettre en pratique ?"

---

## Intégration Frontend

### Fichiers à Modifier

**1. profil.html**
```javascript
// Initialiser userId à la première visite
let userId = localStorage.getItem('novai_userId');
if (!userId) {
    const response = await fetch('/api/user/new');
    const data = await response.json();
    userId = data.userId;
    localStorage.setItem('novai_userId', userId);
}

// Envoyer message à l'IA
async function sendMessage(message) {
    const response = await fetch('/api/chat-profil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            userId: userId,
            conversationHistory: conversationHistory
        })
    });
    const data = await response.json();
    return data.reply;
}
```

**2. gouts.html**
```javascript
// Même structure que profil.html mais avec endpoint /api/chat-gouts
async function sendMessage(message) {
    const response = await fetch('/api/chat-gouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            userId: userId,
            conversationHistory: conversationHistory
        })
    });
    const data = await response.json();
    return data.reply;
}
```

---

## Extraction et Stockage des Données

### Processus Actuel

Chaque message et réponse IA est stocké dans `conversation_history`. 

### Processus Futur (Optionnel)

Pour extraire automatiquement des données structurées:

```javascript
// Créer un nouvel endpoint pour l'extraction
POST /api/extract-profil/:userId
```

Utiliser une deuxième requête OpenAI avec prompt d'extraction:
```
"À partir de cette conversation, extrais et structure:
- I (Introvert/Extravert/Équilibre)
- A (Analyste/Créatif/Équilibre)  
- G (Généraliste/Spécialiste/Équilibre)
- Points forts
- Défis personnels
Format JSON."
```

---

## Données Collectées

### Section Profil
- Identité (nom, âge, localisation)
- Parcours (expériences, projets, domaines explorés)
- Profil IAG (Introversion/Extraversion, Analyste/Créatif, Généraliste/Spécialiste)
- Points forts et défis personnels

### Section Goûts
- Domaines tech/science d'intérêt
- Thèmes transversaux (espace, IA, cybersécurité, etc.)
- Industries attirantes
- Valeurs professionnelles (impact social, innovation, stabilité)
- Type d'environnement préféré (startup, grand groupe, recherche, etc.)

---

## Roadmap d'Améliorations

### Phase 1 (Fait)
✅ Structure documents profil/goûts
✅ Endpoints IA adaptatives
✅ Stockage en mémoire
✅ Système de détection de mots-clés

### Phase 2 (À Faire)
- [ ] Extraction automatique de données structurées
- [ ] Database permanente (MongoDB/PostgreSQL)
- [ ] Page de visualisation du profil complété
- [ ] Matching avec métiers basé sur le profil

### Phase 3 (À Faire)
- [ ] Recommandation de métiers basée sur IAG + Goûts
- [ ] Quiz supplémentaires basés sur le profil
- [ ] Export PDF du profil utilisateur
- [ ] Suivi d'évolution du profil dans le temps

---

## Testing

### Endpoint User
```bash
curl http://localhost:5000/api/user/new
# Retourne: { userId: "user_...", profile: {...} }
```

### Endpoint Profil Chat
```bash
curl -X POST http://localhost:5000/api/chat-profil \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Je m aime créer et résoudre des problèmes",
    "userId": "user_123",
    "conversationHistory": []
  }'
```

### Endpoint Goûts Chat
```bash
curl -X POST http://localhost:5000/api/chat-gouts \
  -H "Content-Type: application/json" \
  -d '{
    "message": "L espace et l IA m intéressent",
    "userId": "user_123",
    "conversationHistory": []
  }'
```

---

## Notes de Production

- **Stockage Actuel**: En mémoire (perte au redémarrage du serveur)
- **Pour Production**: Remplacer par MongoDB, PostgreSQL, ou Firebase
- **Rate Limiting**: À ajouter sur les endpoints API
- **Authentification**: À ajouter (actuellement userId simple)
- **Sécurité**: HTTPS, validation/sanitization des inputs, CORS configuré

