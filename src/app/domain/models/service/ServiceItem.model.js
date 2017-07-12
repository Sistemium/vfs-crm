'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServiceItem',
      relations: {
        hasOne: {
          ServicePoint: {
            localField: 'servicePoint',
            localKey: 'servicePointId'
          },
          FilterSystem: {
            localField: 'filterSystem',
            localKey: 'filterSystemId'
          },
          Employee: [{
            localField: 'installingMaster',
            localKey: 'installingMasterId'
          },{
            localField: 'servingMaster',
            localKey: 'servingMasterId'
          }]

        }
      }

    });

  });

})();
