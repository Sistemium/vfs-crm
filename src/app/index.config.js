'use strict';

(function () {

  angular
    .module('webPage')
    .run(run)
    .service('DEBUG', debugService)
    .config(localStorageServiceProvider => {
      localStorageServiceProvider.setPrefix('vfs');
    })
    .config($locationProvider => {
      $locationProvider.hashPrefix('');
    })
    .config($compileProvider => {
      $compileProvider.preAssignBindingsEnabled(true);
    })
  ;

  function debugService(saDebug) {
    return saDebug.log('stg:log');
  }

  function run(Sockets, InitService, $rootScope, IOS, localStorageService, DEBUG) {

    InitService
      .then(Sockets.init)
      // .then(saApp.init)
      .catch(error => localStorageService.set('error', angular.toJson(error)));

    // Auth.init(IOS.isIos() ? IOS.init() : phaService).then();

    function afterAuth(authorization) {

      console.log('Auth', authorization);

      let socket = InitService.localDevMode ? 'socket2' : 'socket';

      let appConfig = {
        url: {
          socket: `https://${socket}.sistemium.com`
        }
      };

      let org = 'vfs';

      if (!IOS.isIos()) {
        angular.extend(appConfig, {
          jsDataPrefix: org + '/',
          org
        });
      }

      InitService.then(() => Sockets.on('connect', sockAuth));
      InitService.init(appConfig);

      function sockAuth() {

        let accessToken = 'token-1';

        Sockets.emit('authorization', {accessToken: accessToken}, function (ack) {
          DEBUG('Socket authorization:', ack);
          $rootScope.$broadcast('authorized')
        });

      }

    }

    afterAuth({});

  }

})();
