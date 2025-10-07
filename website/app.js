require('dotenv').config()

const express = require('express');

const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for requests
app.listen(3000);

// ROUTES
// render views
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/news', (req, res) => {
    res.render('news');
});

// redirects

// 404 page
app.use((req, res) => {
    res.status(404).render('404');
});