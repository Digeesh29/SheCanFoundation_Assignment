try { require('dotenv').config(); } catch (_) {}

const express = require('express');
const path = require('path');
const { config, debugLog } = require('./config');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.use('/api/contact', require('./she-can-router'));
app.get('/api/messages', require('./api/messages'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
});

app.listen(config.port, () => {
    debugLog(`She Can Foundation server running at http://localhost:${config.port}`);
});

module.exports = app;
