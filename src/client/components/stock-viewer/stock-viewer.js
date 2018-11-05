const ReactDataGrid = require('react-data-grid');
const React = require('react');
import _ from 'lodash';

class StockViewer extends React.Component {

  rowGetter = rowIdx => this.props.data[rowIdx];

  createColumns(data) {
    const firstStock = _.first(data);
    const headers = _.keys(firstStock);
    return headers.map(header => ({
      key: header,
      name: header.toUpperCase()
    }));
  }

  render() {
    const { data } = this.props;
    const columns = this.createColumns(data);
    return (
      <ReactDataGrid
        enableCellSelect
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={data.length}
        minHeight={800}
      />);
  }
}

export default StockViewer;