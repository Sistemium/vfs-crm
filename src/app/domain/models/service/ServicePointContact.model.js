'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServicePointContact',

      relations: {
        hasOne: {
          ServicePoint: {
            localField: 'servicePoint',
            localKey: 'servicePointId'
          },
          Person: {
            localField: 'person',
            localKey: 'personId'
          }
        }
      },

      methods: {
        isValid
      }

    });

    function isValid() {
      return true;
    }

  });

})();
