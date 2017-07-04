'use strict';

(function () {

  function saApp($window, Schema, UUID) {

    const appIdKey = 'saAppId';
    const VERSION = '0.12.4';

    let appId = $window.localStorage.getItem(appIdKey);

    if (!appId) {
      appId = UUID.v4();
      $window.localStorage.setItem(appIdKey, appId)
    }

    function init() {

      const LogMessage = Schema.model('LogMessage');
      const logMsg = {
        event: 'appInit',
        appName: 'j-sistemium',
        appId: appId,
        version: VERSION
      };

      LogMessage.create({
        text: angular.toJson(logMsg),
        type: 'important',
        source: 'jsdata'
      });

    }

    return {
      init,
      version: () => VERSION
    };

  }

  angular.module('core.services')
    .service('saApp', saApp);

})();
