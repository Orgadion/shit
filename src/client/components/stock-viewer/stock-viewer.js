const ReactDataGrid = require('react-data-grid');
const React = require('react');
import _ from 'lodash';

class StockViewer extends React.Component {

  rowGetter = rowIdx => this.props.data[rowIdx];

  createColumns() {
    const headers = _.keys(_.get(this,'props.cols',{}));
    return headers.map(header => ({
      key: header,
      name: header.toUpperCase()
    }));
  }

  render() {
    const { data } = this.props;
    const columns = this.createColumns();
    return (
      <ReactDataGrid
        enableCellSelect
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={data.length}
        minHeight={800}
        rowHeight={30}
      />);
  }
}

export default StockViewer;