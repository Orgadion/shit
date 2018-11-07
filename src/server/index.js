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
        sumValue:0,
        data: {}
    },
    shorts:{
        sumValue:0,
        data: {}
    }
};

function updateStock(id, amount,fromStocks,toStocks = undefined, value = undefined ) {
    const stock = fromStocks.data[id];
    if(stock) {
        fromStocks.sumValue -= amount;
        delete fromStocks.data[id];
    }
    if(toStocks){
        toStocks.sumValue += amount;
        return value / toStocks.sumValue;
    }
    return undefined;
}

function getValuePer(id, amount, value) {
    if(amount == 0) {
        updateStock(id, amount,stocks.shorts);
        return updateStock(id, amount, stocks.longs);;
    }
    else if(amount > 0) {
        return updateStock(id, amount,stocks.shorts, stocks.longs, value);
    }
    else {
        return updateStock(id, amount, stocks.shorts, stocks.longs, value);
    }
}

function makeStockData(stock, data) {
    //console.log("stock data", {stock:stock,data:data});
    const amount = stock.StartDayQty + stock.FillQty;
    const value = amount * data.GetManyFieldsResult.Values[1];
    const valuePer = getValuePer(stock.securityID, amount, value);

    if(!valuePer) {
        return;
    }


    stockData = {
        "id": stock.securityID,
        "name": data.GetManyFieldsResult.Values[0],
        "value": value,
        "valuePer": valuePer,
        "amount": amount,
        "syn_diff": data.GetManyFieldsResult.Values[2]
    };
    if(amount > 0) {
        stocks.longs.data[stock.securityID] = stockData;
    }
    else {
        stocks.shorts.data[stock.securityID] = stockData;
    }

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
