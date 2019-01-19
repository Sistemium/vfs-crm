'use strict';

(function () {

  function InitService($rootScope, $q) {

    const me = this;
    let isInitialized = false;
    const localDevMode = !!location.port;

    me.initializedEvent = 'init-service-ready';

    const state = {
      localDevMode: localDevMode,
      url: {
        socket: localDevMode ? 'http://localhost:8000' : 'https://socket.sistemium.com',
        auth: 'https://api.sistemium.com/pha',
        jsd: window.localStorage.getItem('JSData.BasePath'),
        v4: 'https://api.sistemium.com/v4',
        api: 'api'
      }
    };

    me.init = function (fn) {
      isInitialized = true;

      if (angular.isFunction(fn)) {
        angular.merge(state, fn(state));
      } else {
        angular.merge(state, fn);
      }

      $rootScope.$broadcast(me.initializedEvent, state);
    };

    let initPromise = $q(function (resolve) {

      let un;

      function respond() {
        if (angular.isFunction(un)) {
          un();
        }
        resolve(state);
      }

      if (isInitialized) {
        respond();
      } else {
        un = $rootScope.$on(me.initializedEvent, respond);
      }

    });

    me.then = function (fn) {
      return (isInitialized ? $q.resolve(state) : initPromise).then(fn);
    };

    return angular.extend(me, state);

  }

  angular.module('core.services')
    .service('InitService', InitService);

})();
