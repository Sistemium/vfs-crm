'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Employee',

      relations: {
        hasMany: {
          ServicePoint: {
            localField: 'ServicePoints',
            localKey: 'ServingMaster'
          },
        }
      }

    });

  });

})();
