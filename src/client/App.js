import React, { Component } from 'react';
import _ from 'lodash';
import './app.css';
import StockViewer from './components/stock-viewer/stock-viewer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { longs: [], shorts: [] };
    this.config = {};
  }

  componentDidMount() {
    const app = this;
    this.getConfig();
    setInterval(function () {
      fetch('/api/getData')
        .then(res => res.json())
        .then((data) => {
            //console.log("app state", {state: longs});
            app.setState({ longs: _.values(data.longs.data), shorts: _.values(data.shorts.data) });
        });
    }, 1000);
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

    const cols = this.config.cols || { longs:{}, shorts:{} };
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            {longs && <StockViewer data={longs} cols={cols.longs} id="longs" />}
          </div>
          <div className="col-lg-6">
            {shorts && <StockViewer data={shorts} cols={cols.shorts} id="shorts" />}
          </div>
        </div>
      </div>
    );
  }
}
