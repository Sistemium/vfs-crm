'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServiceItemService',

      relations: {
        hasOne: {
          Employee: {
            localField: 'servingMaster',
            localKey: 'servingMasterId'
          },
          ServiceItem: {
            localField: 'serviceItem',
            localKey: 'serviceItemId'
          }
        }
      },

      methods: {
        isValid,
      },

      computed: {
        typeIcon: ['type', typeIcon],
      },

      meta: {
        label: {
          add: 'Naujas įrenginio aptarnavimas',
          about: 'įrenginio aptarnavimo'
        }
      },

      beforeCreateInstance: function (model, item) {

        return _.defaults(item, { type: 'service' });

      },

    });

    function isValid(readyState) {
      return this.date && (this.serviceItemId || _.get(readyState, 'serviceItemId.ready'));
    }

    function typeIcon(type) {
      switch (type) {
        case 'pause':
          return 'red glyphicon glyphicon-pause';
        case 'forward':
          return 'blue glyphicon glyphicon-forward';
        default:
          return 'green glyphicon glyphicon-check';
      }
    }

  });

})();
