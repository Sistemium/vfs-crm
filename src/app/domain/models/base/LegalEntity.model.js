'use strict';

(function () {

  angular.module('Models').run(Schema => {

    Schema.register({

      name: 'LegalEntity',

      relations: {

        hasOne: {},

        hasMany: {
          ServiceContract: {
            localField: 'serviceContracts',
            foreignKey: 'customerLegalEntityId'
          }
        }

      },

      methods: {
        isValid
      },

      meta: {
        label: {
          add: 'Nauja imonė'
        }
      }

    });

    function isValid() {
      return this.name && this.code;
    }

  });

})();
