const fetch = require("node-fetch");
const express = require('express');
const _ = require('lodash');
const app = express();
const data = require('../mocks/mock-table.json');
const config = require('../mocks/consts.json');
const mock = _.values(data);
const bodyParser = require('body-parser');
const stocks = {
    longs:{
        data: {}
    },
    shorts:{
        data: {}
    }
};

function calcPrecentages(toUpdate) {
    _.forEach(toUpdate,stocks => {
        const sum = _.sumBy(_.values(stocks.data),'value');
        _.forEach(stocks.data, stock =>stock.valuePer = stock.value / sum);
    });
}

function updateStock(stock, fromStocks, toStocks = undefined) {
    let toUpdate = [];
    if(fromStocks.data[stock.id]) {
        delete fromStocks.data[stock.id];
        toUpdate.push(fromStocks);
    }
    if(toStocks){
        toStocks.data[stock.id] = stock;
        toUpdate.push(toStocks);
    }
    calcPrecentages(toUpdate);
}

function updateStocksData(stockData) {
    if(stockData.amount == 0) {
        updateStock(stockData,stocks.shorts);
        updateStock(stockData, stocks.longs);
    }
    else if(stockData.amount > 0) {
        updateStock(stockData,stocks.shorts, stocks.longs);
    }
    else {
        updateStock(stockData, stocks.longs, stocks.shorts);
    }
}

function makeStockData(stock, data) {
    //console.log("stock data", {stock:stock,data:data});
    const amount = stock.StartDayQty + stock.FillQty;
    const value = amount * data.GetManyFieldsResult.Values[1];

    let stockData = {
        id: stock.securityID,
        name: data.GetManyFieldsResult.Values[0],
        value: value,
        valuePer: 0,
        amount: amount,
        syn_diff: data.GetManyFieldsResult.Values[2]
    };

    updateStocksData(stockData);
    //console.log("final stock data", {stockData:stockData})
}

app.use(express.static('dist'));
app.use(bodyParser.json())

app.get('/api/getData', (req, res) => {
   // console.log(stocks);
  return res.send(stocks);
});

app.get('/api/getCols', (req, res) => {
  return res.send(config);
});

app.post('/gili', (req, res) => {
    const stock = req.body;
    const id = Number(stock.securityID);
    console.log(id);
    fetch(config.ace.stockData.replace(config.ace.token, id))
        .then(res=> res.json())
            .then(data => makeStockData(stock, data));
  }
);

const port = config.deborah.port;
app.listen(port, () => console.log('Listening on port ' + port));

setInterval(function () {
  const rand = Math.floor(Math.random() * mock.length);
  const stock = mock[rand];
    const id = Number(stock.securityID);
    fetch(config.ace.stockData.replace(config.ace.token, id))
        .then(res=> res.json())
            .then(data => makeStockData(stock, data));
}, 1000);
