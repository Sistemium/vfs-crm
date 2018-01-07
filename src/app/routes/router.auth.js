'use strict';

(function () {

  function routerAuth ($rootScope) {

    function init () {

      $rootScope.$on('$stateChangeStart', function (event, next, nextParams) {

        let needRoles = _.get(next, 'data.needRoles');

        if (needRoles) {
          event.preventDefault();
        }

        console.error('routerAuth prevents:', next, nextParams, needRoles);

      });

    }

    return {
      init: init
    };

  }

  angular.module('core.services')
    .service('routerAuth', routerAuth);

})();
