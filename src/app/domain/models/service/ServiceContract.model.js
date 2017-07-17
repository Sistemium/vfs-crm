'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServiceContract',

      relations: {
        hasOne: {
          Person: {
            localField: 'person',
            localKey: 'personId'
          }//,
          // LegalEntity: {
          //   localField: 'legalEntity',
          //   localKey: 'legalEntityId'
          // }
        }
      }

    });

  });

})();
