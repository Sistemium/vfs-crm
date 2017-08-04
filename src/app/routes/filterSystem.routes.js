'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'filterSystem',
          url: '/filterSystem',
          template: '<filter-system-master></filter-system-master>',

          data: {
            title: 'Filtravimo Sistemos'
          }

        })

    });

})();
