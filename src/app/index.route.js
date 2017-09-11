'use strict';

(function () {

  angular
    .module('webPage')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/?access-token',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
