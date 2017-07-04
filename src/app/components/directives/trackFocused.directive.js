'use strict';

(function () {

  function trackFocused(IOS, $rootScope) {
    return {

      restrict: 'A',

      link: function (scope, element) {

        if (!IOS.isIos()) return;

        element.on('focus', function () {
          $rootScope.hasInputInFocus = true;
        });

        element.on('blur', function () {
          $rootScope.hasInputInFocus = false;
        });

      }

    };
  }

  angular.module('sistemium.directives')
    .directive('trackFocused', trackFocused);

})();
