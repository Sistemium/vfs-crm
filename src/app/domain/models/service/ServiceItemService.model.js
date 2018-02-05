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
        isValid
      },

      meta: {
        label: {
          add: 'Naujas įrenginio aptarnavimas',
          about: 'įrenginio aptarnavimo'
        }
      }

    });

    function isValid(data) {
      return this.date && (this.serviceItemId || _.get(data, 'serviceItemId.ready'));
    }

  });

})();