'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Person',

      relations: {

        hasMany: {
          ServiceContract: {
            localField: 'serviceContracts',
            foreignKey: 'customerPersonId'
          }
        }

      },

      computed: {
        name: ['firstName', 'lastName', name]
        // phoneNumber: ['phone', function (phone) {
        //   return phone || '+37060010001';
        // }]
      },

      methods: {
        isValid
      }

    });

    function isValid() {
      return this.firstName && this.lastName;
    }

    function name(firstName, lastName) {
      return `${firstName} ${lastName}`;
    }

  });

})();
