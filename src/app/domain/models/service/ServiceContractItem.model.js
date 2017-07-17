'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServiceContractItem',

      relations: {
        hasOne: {
          ServiceContract: {
            localField: 'serviceContract',
            localKey: 'serviceContractId'
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
