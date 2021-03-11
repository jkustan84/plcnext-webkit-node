const express = require('express');
const app = express();
const PORT = 3001;
const apiData = require('./plcnextAPI');


let myData = {
    msg: 'Hello from somewhere else!'
};


app.use(express.static(__dirname + '/'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.send('Hello World!');
    // // res.render('index.html');
    res.render('index.ejs', {myData, apiData});
});

app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}...`);
});