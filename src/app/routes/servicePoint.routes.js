'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'servicePoints',
          url: '/servicePoints',
          template: '<service-point-list></service-point-list>',

          data: {
            title: 'Aptarnavimo taškai'
          },

          children: [{

            name: 'detailed',
            url: '/:servicePointId',
            template: '<service-point-details></service-point-details>',

            data: {
              rootState: 'servicePoints'
            }

          }]

        });

    });

})();
