import React, { Component } from 'react';
import _ from 'lodash';
import './app.css';
import StockViewer from './components/stock-viewer/stock-viewer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { longs: [], shorts: [] };
  }

  componentDidMount() {
    const this2 = this;
    this.getConfig();
    setInterval(function () {
      fetch('/api/getData')
        .then(res => res.json())
        .then((data) => {
          let longMap = [];
          let shortMap = [];

          _.map(data, stock => {
            if (stock.StartDayQty < 0) {
              longMap.push(stock);
            }
            else {
              shortMap.push(stock);
            }
          });
          this2.setState({ longs: longMap, shorts: shortMap });
        });
    }, 500);
  }

  getConfig(){
  const app = this;
  fetch('/api/getCols')
      .then(res => res.json())
      .then((data) => {
          console.log(data);
          this.config = data;
      });
  }

  render() {
    const { longs, shorts } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            {longs && <StockViewer data={longs} cols={this.config.cols.longs} id="longs" />}
          </div>
          <div className="col-lg-6">
            {shorts && <StockViewer data={shorts} cols={this.config.cols.shorts} id="shorts" />}
          </div>
        </div>
      </div>
    );
  }
}
