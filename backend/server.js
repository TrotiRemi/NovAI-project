require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/chat.html'));
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

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur NovAI en cours d'exécution sur http://localhost:${PORT}`);
});
