const express = require('express');
//const os = require('os');
const app = express();
const mock =  Object.values(require('../mocks/mock-table.json'));
const bodyParser = require('body-parser');
const stocks = new Map();
app.use(express.static('dist'));
app.use(bodyParser.json())
app.get('/api/getData', (req, res) => {
    const myKeys = stocks.keys();
    const mapAsJson = myKeys.reduce((key,accu)=> {
        const value = myKeys.get(key);
        return {
            [key]: value,
            ...accu,
        };
    },{});
    res.send(mapAsJson)
});
app.post('/gili', (req, res) => {
    console.log('Hi IM HERERERERER')
    const stock = req.body;
    console.log(stock);
    console.log(stock.SecurityID);
    stocks.set(stock.SecurityID,stock);
  }
    );
app.listen(8080, () => console.log('Listening on port 80!'));
setInterval(function(){
    const rand = Math.floor(Math.random() * mock.length);
    const stock = mock[rand]
    console.log(stock);
    stocks.set(stock.SecurityID,stock);
    }, 1000);
