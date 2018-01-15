'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServicePlanning',

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
      }

    });

  });

})();
