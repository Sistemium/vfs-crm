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

    const socketAuth = $q(resolve => $rootScope.$on('socket:authorized', resolve));

    auth.login = (token) => {

      return login(token)
        .then(authorization => socketAuth.then(() => authorization));

    };

    return auth;

  }

})();
