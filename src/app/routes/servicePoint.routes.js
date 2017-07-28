'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'servicePoint',
          url: '/servicePoint',
          template: '<service-point-master></service-point-master>',

          data: {
            title: 'Aptarnavimo taškai'
          },

          children: [{

            name: 'detailed',
            url: '/:servicePointId',
            template: '<service-point-details></service-point-details>',

            data: {
              title: 'Aptarnavimo taškas',
              rootState: 'servicePoint'
            }

          }]

        });

    });

})();
