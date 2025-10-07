require('dotenv').config()

const express = require('express');

const app = express();

// listen for requests
app.listen(3000);

// ROUTES
app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname });
});

app.get('/news', (req, res) => {
    res.sendFile('./views/news.html', { root: __dirname });
});