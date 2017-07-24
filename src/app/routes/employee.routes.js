'use strict';

(function () {

  angular.module('webPage')
  .config(function (stateHelperProvider) {

    stateHelperProvider

    .state({

      name: 'employee',
      url: '/employee',
      template: '<employee></employee>',

      defaultChild: 'tiles',

      data: {
        title: 'Darbuotojai'
      },

      children: [
        {

          name: 'tiles',
          url: '/tiles',
          template: '<employee-tile-view employees="vm.employees"></employee-tile-view>',

          data: {
            title: 'Darbuotojai',
            rootState: 'employee.tiles'
          }

        },
        {

          name: 'table',
          url: '/table',
          template: '<employee-table-view></employee-table-view>',

          data: {
            title: 'Darbuotojai',
            rootState: 'employee.table'
          }

        }

      ]

    });

  });

})();
