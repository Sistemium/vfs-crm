'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'legalEntity',
          url: '/legalEntity',
          template: '<legal-entity-master></legal-entity-master>',

          data: {
            title: 'Įmonės'
          }

        });

    });

})();
