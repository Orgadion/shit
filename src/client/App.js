import React, { Component } from 'react';
import _ from 'lodash';
import './app.css';
import StockViewer from './components/stock-viewer/stock-viewer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { longs: [], shorts: [], risk: [] };
    this.config = {};
  }

  componentDidMount() {
    const app = this;
    this.getConfig();
    setInterval(function () {
      fetch('/api/getData')
        .then(res => res.json())
        .then((data) => {
            console.log("app data", {data: data.riskTable});
            app.setState({ longs: _.values(data.longs.data), shorts: _.values(data.shorts.data), risk: data.riskData });
        });
    }, 1000);
  }

  getConfig(){
  const app = this;
  fetch('/api/getCols')
      .then(res => res.json())
      .then((data) => {
          //console.log(data);
          this.config = data;
      });
  }

  render() {
    const { longs, shorts, risk } = this.state;

    const cols = this.config.cols || { longs:{}, shorts:{} };
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2">
            {risk && <StockViewer  className={'risk'} data={risk} cols={cols.risk}  id="risk"/>}
          </div>
          <div className="col-lg-5">
            {longs && <StockViewer  className={'longs'} data={longs} cols={cols.longs} reverse={true}  id="longs"/>}
          </div>
          <div className="col-lg-5">
            {shorts && <StockViewer className={'shorts'} data={shorts} cols={cols.shorts} id="shorts"/>}
          </div>
        </div>
      </div>
    );
  }
}
