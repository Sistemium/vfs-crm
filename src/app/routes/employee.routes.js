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
          },

          children: [
            {

              name: 'detailedTiles',
              url: '/detailedTiles',
              template: '<employee-tile-view></employee-tile-view>',

              data: {
                title: 'Darbuotojai',
                rootState: 'employee'
              }

            },
            {

              name: 'detailedTable',
              url: '/detailedTable',
              template: '<employee-table-view></employee-table-view>',

              data: {
                title: 'Darbuotojai',
                rootState: 'employee'
              }

            }


          ]

        });

    });

})();
