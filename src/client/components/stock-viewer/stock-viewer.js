const ReactDataGrid = require('react-data-grid');
const React = require('react');
const Immutable = require('immutable');

class StockViewer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._columns = this.createColumns();
        this._rows = this.createRows();
        this.state = { rows: new Immutable.fromJS(this._rows) };
    }

    createColumns = () => {
        let cols = [];
        Object.keys(this.props.data[0]).forEach(val => cols.push({
           key:val,
           name: val.toUpperCase()
        }));
        return cols;
    };

    createRows = () => {
        let rows = [];
        const data = this.props.data;
        for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
            let row = {};
            this._columns.forEach((c, colIdx) => row[c.key] = data[rowIdx][c.key]);
            rows.push(row);
        }

        return rows;
    };

    rowGetter = (rowIdx) => {
        return this.state.rows.get(rowIdx);
    };

    render() {
        return  (
            <ReactDataGrid
                enableCellSelect={true}
                columns={this._columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.size}
                />);
    }
}

export default StockViewer;