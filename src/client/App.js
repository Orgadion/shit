import React, { Component } from 'react';
import './app.css';
import StockViewer from "./components/stock-viewer/stock-viewer";

export default class App extends Component {
  state = { table: null };

  componentDidMount() {
    fetch('/api/getData')
      .then(res => res.json())
      .then(this.parseStocks.bind(this));
  }

  parseStocks(data) {
    let longMap = new Map();
    let shortMap = new Map();

    for (let k of Object.keys(data)) {
      if( data[k].StartDayQty < 0) {
          longMap.set(k, data[k]);
      }
      else {
          shortMap.set(k, data[k]);
      }
    }

    this.setState({ longs:longMap, shorts: shortMap});
  }

  render() {
    const { state } = this.state;
    return (
      <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
                { state.longs ? <StockViewer data={state.longs}/> : ''}
            </div>
            <div className="col-lg-6">
                { state.shorts ? <StockViewer data={state.shorts}/> : ''}
            </div>
          </div>
      </div>
    );
  }
}
