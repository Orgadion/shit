const express = require('express');
const _ = require('lodash');
const app = express();

const data = require('../mocks/mock-table.json');
const mock = _.values(data);
const bodyParser = require('body-parser');
const stocksObj = {};
app.use(express.static('dist'));
app.use(bodyParser.json())

app.get('/api/getData', (req, res) => {
  const arr = _.values(stocksObj);
  return res.send(JSON.stringify(arr));
});

app.post('/gili', (req, res) => {
    console.log('Hi IM HERERERERER')
    const stock = req.body;
    console.log(stock);
    console.log(stock.SecurityID);
    stocks.set(stock.SecurityID, stock);
  }
);

app.listen(8080, () => console.log('Listening on port 80!'));

setInterval(function () {
  const rand = Math.floor(Math.random() * mock.length);
  const stock = mock[rand];
  stocksObj[stock.securityID] = stock;
}, 200);
