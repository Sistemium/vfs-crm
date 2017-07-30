'use strict';

(function () {

  angular.module('webPage')
  .config(function (stateHelperProvider) {

    stateHelperProvider

    .state({

      name: 'person',
      url: '/person',
      template: '<person-master></person-master>',

      data: {
        title: 'Asmenys'
      }

    });

  });

})();
