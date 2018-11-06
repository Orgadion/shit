const express = require('express');
const _ = require('lodash');
const app = express();
const data = require('../mocks/mock-table.json');
const config = require('../mocks/consts.json');
const mock = _.values(data);
const bodyParser = require('body-parser');
const stocksObj = {};
app.use(express.static('dist'));
app.use(bodyParser.json())

app.get('/api/getData', (req, res) => {
  const arr = _.values(stocksObj);
  return res.send(JSON.stringify(arr));
});

app.get('/api/getCols', (req, res) => {
  return res.send(config);
});

app.post('/gili', (req, res) => {
    const stock = req.body;
    stocksObj[stock.securityID] = stock;
    console.log(stock.securityID)
  }
);

app.listen(80, () => console.log('Listening on port 80!'));

// setInterval(function () {
//   const rand = Math.floor(Math.random() * mock.length);
//   const stock = mock[rand];
//   stocksObj[stock.securityID] = stock;
// }, 200);
