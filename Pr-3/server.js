    
    const express = require('express');
    const app = express();
    app.set('view engine', 'ejs');
    app.use(express.static('public'));

    app.get('/', (req, res) => {
    
        res.render('index');

    });

    app.get('/chart', (req, res) => {
        res.render('chart');
    })


    app.get('/widgets', (req, res) => {
        res.render('widgets');
    })

    app.get('/tables', (req, res) => {
        res.render('tables');
    })
    

    app.get('/buttons', (req, res) => {
        res.render('pages-buttons');
    })

    app.get('/icon-fontawesome' , (req , res) => {
        res.render('icon-fontawesome');
    })

    app.get('/icon-material', (req, res) => {
        res.render('icon-material');
    })

     app.get('/pages-elements', (req, res) => {
        res.render('pages-elements');
    })

    app.get('/form-basic' , (req, res) => {
        res.render('form-basic');
    })

    app.get('/form-wizard', (req , res) => {
        res.render('form-wizard');
    })

     app.get('/index', (req , res) => {
        res.render('index');
    })

     app.get('/grid', (req , res) => {
        res.render('grid');
    })
    app


    app.listen(5000, () => {
        console.log('Server running on port http://localhost:5000');
    })
 