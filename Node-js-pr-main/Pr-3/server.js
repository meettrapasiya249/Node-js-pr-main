const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
 
    res.render('index');

});

app.get('/chart', (req, res) => {
    res.render('charts');
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
 

app.listen(5000, () => {
    console.log('Server running on port http://localhost:5000');
})