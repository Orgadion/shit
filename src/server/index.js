const express = require('express');
//const os = require('os');
const app = express();
const mock = require('../mocks/mock-table.json');

app.use(express.static('dist'));
app.get('/api/getData', (req, res) => res.send(mock));
app.get('/gili', (req, res) => console.log('Hi IM HERERERERER'));

app.listen(8080, () => console.log('Listening on port 8080!'));
