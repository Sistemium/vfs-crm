'use strict';

(function () {

  angular.module('webPage')
  .config(function (stateHelperProvider) {

    stateHelperProvider

    .state({

      name: 'filterSystem',
      url: '/filterSystem',
      template: '<filter-system></filter-system>',

      data: {
        title: 'Filtro sistemos'
      },

    });

  });

})();
