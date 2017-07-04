'use strict';

(function () {

  angular.module('sistemium.directives')
    .directive('onEnter', onEnter);

  function onEnter() {

    return function (scope, element, attrs) {

      element.bind('keydown keypress', (event) => {

        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.onEnter, {'event': event});
          });

          event.preventDefault();
        }

      });

    };

  }

})();
