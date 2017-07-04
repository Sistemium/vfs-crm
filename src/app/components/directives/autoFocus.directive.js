'use strict';

(function () {

  function autoFocus($timeout, IOS) {

    var ios = IOS.isIos();

    return {

      restrict: 'AC',

      scope: {
        autoFocus: '@'
      },

      link: function (_scope, _element) {

        let value = _scope.autoFocus;
        let element = _element[0];

        if (value === 'false' || ios){
          return;
        }

        $timeout(100)
          .then(() => {
            element.focus();
            if (value === 'select') {
              element.setSelectionRange(0, element.value.length);
            }
          });

        if (_scope.autoFocus !== 'true'){
          return;
        }

        _element.bind('blur', () => {
          $timeout(100)
            .then(() => element.focus());
        });

      }
    };
  }

  angular.module('core.services')
    .directive('autoFocus', autoFocus);

})();
