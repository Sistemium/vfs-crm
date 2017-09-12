'use strict';

(function () {

  angular.module('jsd').run(function (Schema) {

    Schema.register({

      name: 'Location',
      endpoint: 'Location',

      labels: {},

      relations: {
        hasOne: {
          ServicePoint: {
            localField: 'servicePoint',
            localKey: 'servicePointId'
          }
        }
      }

    });

  });

})();
