'use strict';

(function () {

  function IosParser() {

    function parserByCode(code, v) {
      switch (code) {
        case 'int':
          return parseInt(v) || 0;
        case 'decimal':
          return parseFloat(v) || 0;
        case 'date':
          return v ? v.substr(0, 10) : null;
      }
    }

    function parseObject(row, model) {

      const fieldTypes = model && model.fieldTypes;

      _.each(fieldTypes, (parser, field) => {

        let value = row[field];
        // TODO: remove parserByCode support to speed up
        row [field] = _.isFunction(parser) ? parser(value) : parserByCode(parser, value);

      });

      return row;

    }

    function parseArray(data, model) {

      const fieldTypes = model && model.fieldTypes;

      if (!fieldTypes) return;

      _.each(data, row => parseObject(row, model));

      return data;

    }

    return {
      parseObject,
      parseArray
    };

  }

  angular.module('Models')
    .service('IosParser', IosParser);

})();
