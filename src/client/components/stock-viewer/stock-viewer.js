const ReactDataGrid = require('react-data-grid');
const React = require('react');
import _ from 'lodash';

class StockViewer extends React.Component {

  rowGetter = rowIdx => this.props.data[rowIdx];

  createColumns() {
    const cols = _.get(this,'props.cols',{});
    const headers = _.keys(cols);
    const res =  headers.map(header => ({
        key: cols[header],
        name: header.toUpperCase()
    }));
    return res;
  }

  render() {
    const  data  = this.props.data;
    console.log("data state:", {data: data});
    const columns = this.createColumns();
    const can = !_.isEmpty(columns);
    console.log("col state:", {canrender:can, cols: columns});
    if(data && can) {
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

    return null;
  }
}

export default StockViewer;
