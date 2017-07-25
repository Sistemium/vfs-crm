'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Person',

      relations: {
        // hasOne: {
        //   localKey: '',
        //   localField: ''
        // }

      },

      computed: {
        // phoneNumber: ['phone', function (phone) {
        //   return phone || '+37060010001';
        // }]
      }

    });

  });

})();
