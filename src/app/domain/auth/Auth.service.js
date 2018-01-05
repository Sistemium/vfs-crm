'use strict';

(function () {

  angular.module('webPage')
    .service('Auth', Auth);

  function Auth (saAuth, saaAppConfig, $rootScope, $q) {

    const config = {
      disableAutoLogin: true,
      authUrl: saaAppConfig.authUrl,
      loadRoles: true
    };

    const auth = saAuth(config);

    const {login} = auth;

    auth.loginPromise = $q(resolve => {

      $rootScope.$on('socket:authorized', (res) => {

        console.info('socket:authorized', res);

        resolve(res);

      });

    });


    auth.login = (token) => {

      return login(token)
        .then(res => {
          return auth.loginPromise.then(() => res);
        });

    };

    return auth;

  }

})();
