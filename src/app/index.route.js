(function () {
  'use strict';

  angular
  .module('webPage')
  .config(routerConfig)
  .run(routerDecorator);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'vm'
    })
    ;

    $urlRouterProvider.otherwise('/');
  }

  function routerDecorator($rootScope, localStorageService, $state) {

    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {

      if (!toState.defaultChild) {
        return;
      }

      let mode = localStorageService.get(`${toState.name}.mode`) || toState.defaultChild;

      //if (toParams.item) {
      //  mode += '.item';
      //  toParams = {
      //    id: toParams.item
      //  }
      //}
      event.preventDefault();

      return $state.go(`${toState.name}.${mode}`, toParams, {inherit: false});

    });

  }

})();
