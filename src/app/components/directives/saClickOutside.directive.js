'use strict';

(function () {

  const BIND_ON = 'touchstart';

  function saClickOutside($document, $parse, IOS) {

    return {

      restrict: 'A',

      link: function (scope, el, attrs) {

        if (!IOS.isIos()) return;

        let evaluateOnClick = $parse(attrs.saClickOutside || `${attrs.outsideIf}=false`);
        let outsideIf = attrs.outsideIf && $parse(attrs.outsideIf);

        function clicker (domEvent) {
          if (outsideIf && outsideIf(scope)) {
            _.result(domEvent, 'preventDefault');
            scope.$apply(() => evaluateOnClick(scope));
          }
        }

        $document.on(BIND_ON, clicker);

        scope.$on('$destroy', () => { $document.off(BIND_ON, clicker); })

      }
    }

  }

  angular.module('ngTouch')
    .directive('saClickOutside', saClickOutside);

})();
