'use strict';

(function () {

  angular.module('webPage')
    .service('Auth', Auth);

  function Auth (saAuth, saaAppConfig) {

    const config = {
      authUrl: saaAppConfig.authUrl,
      loadRoles: true
    };

    return saAuth(config);

  }

})();
