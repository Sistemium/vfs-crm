'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServicePoint',

      relations: {
        hasOne: {
          Employee: {
            localField: 'employee',
            foreignId: 'servingMaster'
          },
        }
      }

    });

  });

})();
