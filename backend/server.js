const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur NovAI en cours d'exécution sur http://localhost:${PORT}`);
});
