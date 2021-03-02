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

  function run(Sockets, InitService, $rootScope, IOS, localStorageService, DEBUG, Auth) {

    InitService
      .then(Sockets.init)
      // .then(saApp.init)
      .catch(error => localStorageService.set('error', angular.toJson(error)));

    // Auth.init(IOS.isIos() ? IOS.init() : phaService).then();

    $rootScope.$on('logged-in', afterAuth);

    /*
    Functions
     */

    function afterAuth() {

      let socket = 'socket3';

      let appConfig = {
        url: {
          socket: `https://${socket}.sistemium.com`
        }
      };

      // appConfig.url.socket = 'http://localhost:8000';

      const devOrg = localStorageService.get('dev');

      const org = `vfs${ devOrg || (InitService.localDevMode && devOrg !== false) ? 'd' : '' }`;

      if (!IOS.isIos()) {
        angular.extend(appConfig, {
          jsDataPrefix: `${org}/`,
          org
        });
      }

      InitService.then(() => Sockets.on('connect', sockAuth));
      InitService.init(appConfig);

      function sockAuth() {

        let accessToken = Auth.getToken();

        if (!accessToken) {
          console.error('sockAuth no token');
          return;
        }

        // if (!IOS.isIos() && !InitService.localDevMode) {
        //   appcache.checkUpdate();
        // }

        Sockets.emit('authorization', {accessToken}, function (ack) {
          DEBUG('Socket authorization:', ack);
          $rootScope.$broadcast('socket:authorized')
        });

      }

    }

  }

})();
