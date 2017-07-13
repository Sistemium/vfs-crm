'use strict';

(function () {

  angular
    .module('webPage')
    .run(run)
    .service('DEBUG', debugService)
    .config(localStorageServiceProvider => {
      localStorageServiceProvider.setPrefix('vfs');
    })
    .run(amMoment => {
      amMoment.changeLocale('lt');
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

  function run(Sockets, InitService, saApp, IOS, localStorageService, DEBUG) {

    InitService
      .then(Sockets.init)
      // .then(saApp.init)
      .catch(error => localStorageService.set('error', angular.toJson(error)));

    // Auth.init(IOS.isIos() ? IOS.init() : phaService).then();

    function afterAuth(authorization) {

      console.log('Auth', authorization);

      let appConfig =
        InitService.localDevMode ? {} :
          {
            url: {
              socket: 'https://socket2.sistemium.com'
            }
          }
      ;

      let org ='vfs';

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
        });

      }

    }

    afterAuth({});

  }

})();
