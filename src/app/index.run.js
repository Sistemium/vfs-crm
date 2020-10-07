'use strict';

(function () {

  angular
    .module('webPage')
    .run(makeMeasureDigest)
    .run(runBlock);

  /** @ngInject */
  function runBlock() {
    // uncomment to check how often browser reloads
    // localStorage.setItem('cnt', parseInt(localStorage.getItem('cnt') || 0) + 1);
  }

  function makeMeasureDigest($window) {
    $window.measureDigest = () =>
      angular.element($window.document.querySelector('[ng-app]'))
        .injector()
        .invoke(function ($rootScope) {
          const a = performance.now();
          $rootScope.$apply();
          console.log('Digest length:', Math.round(performance.now() - a));
        });
  }

})();
