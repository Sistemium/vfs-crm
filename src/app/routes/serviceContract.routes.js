'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'serviceContract',
          url: '/serviceContract?q',
          template: '<service-contract-master></service-contract-master>',

          data: {
            title: 'Aptarnavimo sutartys'
          }

        });

    });

})();
