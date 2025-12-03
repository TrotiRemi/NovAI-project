require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
const { generateUserId, createOrGetProfile, addToConversationHistory, getConversationHistory } = require('./services/profileStorage');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure OpenAI client avec variable d'environnement
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/api/welcome', (req, res) => {
    res.json({ message: 'Bienvenue sur le site de NovAI' });
});

// GET /api/user/new -> Create new user profile and get user ID
app.get('/api/user/new', (req, res) => {
    try {
        const userId = generateUserId();
        const profile = createOrGetProfile(userId);
        res.json({ 
            userId: userId,
            profile: profile
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user profile' });
    }
});

// GET /api/user/:userId -> Get user profile
app.get('/api/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const profile = createOrGetProfile(userId);
        res.json(profile);
    } catch (err) {
        console.error('Error getting user:', err);
        res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/journey.html'));
});

app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/quiz.html'));
});

app.get('/events.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/events.html'));
});

app.get('/personality.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/personality.html'));
});

app.get('/logout.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/logout.html'));
});

app.get('/journey.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/journey.html'));
});

app.get('/personality-journey.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/personality-journey.html'));
});

app.get('/quiz-journey.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/quiz-journey.html'));
});

app.get('/profil.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profil.html'));
});

app.get('/gouts.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/gouts.html'));
});

app.get('/capacites.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/capacites.html'));
});

// POST /api/chat -> proxy to OpenAI Chat Completions (using OpenAI v4 SDK)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'No message provided' });

        // Using the v4 OpenAI JS SDK shape: client.chat.completions.create(...)
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            max_tokens: 800,
        });

        const choice = response && response.choices && response.choices[0];
        const reply = choice && (choice.message?.content || choice.delta?.content || choice.text)
            ? (choice.message?.content || choice.delta?.content || choice.text)
            : 'Désolé, je n\'ai pas obtenu de réponse.';

        res.json({ reply });
    } catch (err) {
        console.error('OpenAI error:', err?.response || err);
        // Attempt to send back the error message for easier debugging (don't expose keys)
        const message = err?.message || 'OpenAI request failed';
        res.status(500).json({ error: message });
    }
});

// POST /api/chat-personality -> Chat with preprompt for personality test
app.post('/api/chat-personality', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        if (!message) return res.status(400).json({ error: 'No message provided' });

        // Preprompt pour le test de personnalité
        const systemPrompt = `Tu es un assistant bienveillant et empathique spécialisé dans l'orientation professionnelle dans le domaine du numérique. Ton rôle est de :
- Poser des questions ouvertes pour comprendre la personnalité, les intérêts et les forces de l'utilisateur
- Identifier les métiers du numérique qui correspondent à son profil
- Être encourageant et positif
- Utiliser un ton amical et accessible
- Proposer des pistes concrètes basées sur les réponses de l'utilisateur
- Après plusieurs échanges, suggérer des métiers du numérique adaptés (développeur, designer UX/UI, data analyst, chef de projet digital, etc.)`;

        // Build conversation with system prompt + history + new message
        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversationHistory || []),
            { role: 'user', content: message }
        ];

        console.log('Personality chat - messages count:', messages.length);

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.8,
        });

        const choice = response && response.choices && response.choices[0];
        const reply = choice && choice.message?.content
            ? choice.message.content
            : 'Désolé, je n\'ai pas obtenu de réponse.';

        res.json({ reply });
    } catch (err) {
        console.error('OpenAI personality chat error:', err?.response || err);
        const message = err?.message || 'OpenAI request failed';
        res.status(500).json({ error: message });
    }
});

// POST /api/chat-profil -> Adaptive questions for user profile (IAG model)
app.post('/api/chat-profil', async (req, res) => {
    try {
        const { message, conversationHistory, userId } = req.body;
        if (!message) return res.status(400).json({ error: 'No message provided' });
        if (!userId) return res.status(400).json({ error: 'No userId provided' });

        // Store user message in profile
        addToConversationHistory(userId, 'profil', 'user', message);

        // Build adaptive system prompt based on conversation context
        let adaptiveGuidance = '';
        if (conversationHistory && conversationHistory.length > 0) {
            // Analyze previous responses to guide next questions
            const previousContent = conversationHistory.map(m => m.content).join(' ').toLowerCase();
            
            if (previousContent.includes('équipe') || previousContent.includes('ensemble')) {
                adaptiveGuidance += '\nL\'utilisateur semble préférer le travail en équipe. Oriente les prochaines questions vers les rôles collectifs.';
            } else if (previousContent.includes('seul') || previousContent.includes('autonome')) {
                adaptiveGuidance += '\nL\'utilisateur semble préférer l\'autonomie. Pose des questions sur les responsabilités individuelles.';
            }
            
            if (previousContent.includes('créat') || previousContent.includes('imagin')) {
                adaptiveGuidance += '\nL\'utilisateur montre une tendance créative. Approfondis cette facette.';
            } else if (previousContent.includes('logique') || previousContent.includes('analyser') || previousContent.includes('résoudre')) {
                adaptiveGuidance += '\nL\'utilisateur montre une tendance analytique. Explore sa capacité de résolution de problèmes.';
            }
        }

        const systemPrompt = `Tu es un conseiller en orientation bienveillant spécialisé dans la compréhension du profil personnel selon le modèle IAG (Introversion/Extraversion, Analyste/Créatif, Généraliste/Spécialiste).

Ton objectif est de :
1. Poser des questions adaptées et progressives pour comprendre le profil IAG de l'utilisateur
2. Les questions doivent évoluer en fonction des réponses précédentes
3. Être encourageant, positif et bienveillant
4. Valider les réponses et construire progressivement une compréhension globale
5. Après 8-10 échanges, synthétiser le profil IAG découvert

Instructions:
- Pose UNE question à la fois, pas plusieurs
- Utilise un ton conversationnel et amical
- Fais des approfondissements pertinents sur les réponses
- Note les éléments qui révèlent I/A/G dans tes analyses
- Sois curieux et patient${adaptiveGuidance}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversationHistory || []),
            { role: 'user', content: message }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 600,
            temperature: 0.8,
        });

        const choice = response && response.choices && response.choices[0];
        const reply = choice && choice.message?.content
            ? choice.message.content
            : 'Désolé, je n\'ai pas obtenu de réponse.';

        // Store bot response in profile
        addToConversationHistory(userId, 'profil', 'assistant', reply);

        res.json({ reply });
    } catch (err) {
        console.error('OpenAI profil chat error:', err?.response || err);
        const message = err?.message || 'OpenAI request failed';
        res.status(500).json({ error: message });
    }
});

// POST /api/chat-gouts -> Adaptive questions for user preferences and interests
app.post('/api/chat-gouts', async (req, res) => {
    try {
        const { message, conversationHistory, userId } = req.body;
        if (!message) return res.status(400).json({ error: 'No message provided' });
        if (!userId) return res.status(400).json({ error: 'No userId provided' });

        // Store user message in profile
        addToConversationHistory(userId, 'gouts', 'user', message);

        // Build adaptive system prompt based on conversation context
        let adaptiveGuidance = '';
        const previousContent = conversationHistory ? conversationHistory.map(m => m.content).join(' ').toLowerCase() : '';
        
        // Detect mentioned domains and technologies
        const domainKeywords = {
            'ia': ['ia', 'intelligence artificielle', 'ml', 'machine learning', 'deep learning'],
            'espace': ['espace', 'satellite', 'aerospace', 'fusée'],
            'cyber': ['cyber', 'sécurité', 'hacka', 'pentesta'],
            'frontend': ['frontend', 'ui', 'design', 'interface', 'ux'],
            'data': ['donnée', 'data', 'analytics', 'statistique'],
            'environnement': ['environnement', 'climat', 'durable', 'vert', 'éco'],
            'jeu': ['jeu', 'gaming', 'game', 'vidéo']
        };

        for (const [domain, keywords] of Object.entries(domainKeywords)) {
            if (keywords.some(kw => previousContent.includes(kw))) {
                adaptiveGuidance += `\nL'utilisateur montre de l'intérêt pour [${domain}]. Approfondis ce domaine spécifique dans tes questions.`;
            }
        }

        // Detect impact/values preferences
        if (previousContent.includes('aider') || previousContent.includes('impact') || previousContent.includes('société')) {
            adaptiveGuidance += '\nL\'utilisateur a un fort intérêt pour l\'impact social. Explore ses causes et valeurs.';
        }
        if (previousContent.includes('innov') || previousContent.includes('créer') || previousContent.includes('nouveau')) {
            adaptiveGuidance += '\nL\'utilisateur privilégie l\'innovation et la création. Explore son envie d\'entrepreneuriat.';
        }

        const systemPrompt = `Tu es un conseiller en carrière spécialisé dans l'identification des goûts et intérêts professionnels dans le secteur technologique.

Ton objectif est de :
1. Découvrir progressivement les domaines, technologies et secteurs qui fascinent l'utilisateur
2. Comprendre ses valeurs professionnelles (impact social, innovation, stabilité, etc.)
3. Identifier le type d'environnement de travail idéal (startup, grand groupe, recherche, etc.)
4. Les questions doivent adapter leur direction selon les domaines mentionnés
5. Créer un portrait progressif des intérêts professionnels

Instructions:
- Pose UNE question à la fois, claire et engageante
- Si l'utilisateur mentionne un domaine précis, approfondir ce domaine
- Utilise des exemples concrets et attractifs
- Fais des connexions entre les réponses pour montrer que tu comprends
- Synthétise progressivement ses intérêts en profils de métiers possibles${adaptiveGuidance}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversationHistory || []),
            { role: 'user', content: message }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 600,
            temperature: 0.8,
        });

        const choice = response && response.choices && response.choices[0];
        const reply = choice && choice.message?.content
            ? choice.message.content
            : 'Désolé, je n\'ai pas obtenu de réponse.';

        // Store bot response in profile
        addToConversationHistory(userId, 'gouts', 'assistant', reply);

        res.json({ reply });
    } catch (err) {
        console.error('OpenAI gouts chat error:', err?.response || err);
        const message = err?.message || 'OpenAI request failed';
        res.status(500).json({ error: message });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur NovAI en cours d'exécution sur http://localhost:${PORT}`);
});
