'use strict';

(function () {

  angular.module('webPage')
    .directive('nextOnEnter', nextOnEnter);

  /** @ngInject */
  function nextOnEnter ($document) {
    return {
      restrict: 'A',
      scope: {
        nextOnEnter: '@'
      },
      link: function(scope,elem) {

        elem.bind('keydown', function(e) {
          var code = e.keyCode || e.which;
          if (code === 13) {
            e.preventDefault();
            var next = $document[0].getElementById(scope.nextOnEnter);
            if (next) {
              next.focus();
            }
          }
        });
      }
    }
  }

})();
