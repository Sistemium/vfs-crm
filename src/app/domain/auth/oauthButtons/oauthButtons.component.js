'use strict';

(function () {

  angular.module('webPage')
    .component('oauthButtons', {

      templateUrl: 'app/domain/auth/oauthButtons/oauthButtons.html',

      bindings: {
        buttonsConfig: '='
      },

      controller: oauthButtonsController,
      controllerAs: 'vm'

    });

  function oauthButtonsController($window, saaAppConfig) {

    const vm = this;

    _.assign(vm, {
      oauthButtonClick
    });

    function oauthButtonClick(btn) {

      let href = `${saaAppConfig.authUrl}/auth/${btn.url}/vfs` +
        `?redirect_uri=${saaAppConfig.redirect_uri}&orgAppId=${saaAppConfig.orgAppId}`;

      $window.location.href = href;

    }

  }

})();
