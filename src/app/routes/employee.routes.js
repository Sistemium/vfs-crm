'use strict';

(function () {

  angular.module('webPage')
  .config(function (stateHelperProvider) {

    stateHelperProvider

    .state({

      name: 'employee',
      url: '/employee',
      template: '<employee-master></employee-master>',

      defaultChild: 'tiles',

      data: {
        title: 'Darbuotojai'
      },

      children: [
        {

          name: 'tiles',
          url: '/tiles',
          template: '<employee-tiles employees="vm.employees"></employee-tiles>',

          data: {
            title: 'Darbuotojai',
            rootState: 'employee.tiles'
          }

        },
        {

          name: 'table',
          url: '/table',
          template: '<employee-table employees="vm.employees"></employee-table>',

          data: {
            title: 'Darbuotojai',
            rootState: 'employee.table'
          }

        }

      ]

    });

  });

})();
