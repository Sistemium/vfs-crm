'use strict';

(function () {

  function ExportExcel(moment, XLSX, FileSaver) {

    return {
      exportArrayWithConfig
    };

    function Workbook() {
      if (!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
    }

    function setCell(ws, cell, ref) {
      ws[XLSX.utils.encode_cell(ref)] = cell;
    }

    function dateNum(v, date1904) {
      if (date1904) v += 1462;
      let epoch = Date.parse(v);
      return Math.ceil((epoch - new Date(1899, 11, 30)) / (24 * 60 * 60 * 1000));
    }

    function worksheetFromArrayWithConfig(data, config) {
      let ws = {};

      let wsCols = [];

      _.each(config, (col, idx) => {

        let cell = {
          v: col.title,
          t: 's',
          s: {
            font: {bold: true},
            alignment: {horizontal: 'center'}
          }
        };

        setCell(ws, cell, {c: idx, r: 0});

      });

      _.each(config, (col, colIdx) => {

        let maxLength = col.title.length;

        _.each(data, (row, rowIdx) => {

          let val = _.get(row, col.property);

          if (val === null || _.isUndefined(val)) return;

          let cell = {
            v: val,
            t: _.isNumber(val) ? 'n' : 's'
          };

          if (val instanceof Date) {
            cell.t = 'n';
            cell.z = col.format || 'yyyy.mm.dd';
            cell.v = dateNum(val, true);
          }

          maxLength = _.max([maxLength, val.toString().length]);

          cell.s = {
            alignment: {vertical: 'top', wrapText: true}
          };

          setCell(ws, cell, {c: colIdx, r: rowIdx + 1});

        });

        wsCols.push({
          wch: _.min([col.maxLength, maxLength + 2])
        });

      });

      let range = {e: {c: config.length - 1, r: data.length}, s: {c: 0, r: 0}};

      ws['!cols'] = wsCols;
      ws['!ref'] = XLSX.utils.encode_range(range);

      return ws;

    }

    function exportArrayWithConfig(data, config, name) {

      let wb = new Workbook();

      name = name || 'Таблица';

      wb.SheetNames.push(name);
      wb.Sheets[name] = worksheetFromArrayWithConfig(data, config);

      let wbOut = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
      let fileName = name + '.xlsx';

      FileSaver.saveWorkBookAs(wbOut, fileName);

    }

  }

  angular.module('webPage')
    .service('ExportExcel', ExportExcel);

})();
