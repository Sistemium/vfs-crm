'use strict';

(function () {

  const BROADCAST_NAME = 'onStmClicked';

  function stmClick($rootScope) {
    return {

      restrict: 'A',

      scope: {
        clickPayload: '=?'
      },

      link: function ($scope, elem, attrs) {
        let code = attrs.stmClick;
        let payload = $scope.clickPayload;
        elem.bind('click', event => {
          event.preventDefault();
          $rootScope.$apply(()=>{
            $rootScope.$broadcast(BROADCAST_NAME, code, event, payload)
          });
        });
      }

    };
  }

  function ClickHelper() {

    return {
      setupController
    };

    function setupController(vm, scope) {
      scope.$on(BROADCAST_NAME, (broadcastEvent, code, domEvent, payload) => {
        let fn = _.get(vm, `${code}Click`);
        if (_.isFunction(fn)) {
          fn(payload, domEvent);
        }
      });
    }
  }

  angular.module('sistemium')
    .directive('stmClick', stmClick)
    .service('ClickHelper', ClickHelper);

})();
