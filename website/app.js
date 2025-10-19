require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');

// express app
const app = express();

// connect to mongodb, listen for requests
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then((result) => console.log("Connected to database."))
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// logging
app.use(morgan('dev'));

// mongoose and mongo sandbox routes

// api routes
app.use('/api', apiRoutes);

// frontend routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/news', (req, res) => {
    res.render('news', { title: 'News' });
});

// redirects

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});