'use strict';

(function () {

  angular.module('Models').run(Schema => {

    Schema.register({

      name: 'LegalEntity',

      relations: {

        hasOne: {
        },

        hasMany: {
          ServiceContract: {
            localField: 'serviceContracts',
            foreignKey: 'customerLegalEntityId'
          }
        }

      }

    });

  });

})();
