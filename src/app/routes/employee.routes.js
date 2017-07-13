'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'employee',
          url: '/employee',
          template: '<employee></employee>',

          data: {
            title: 'Darbuotojai'
          }

        });

    });

})();
