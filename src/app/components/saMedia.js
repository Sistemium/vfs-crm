'use strict';

(function () {

  function saMedia($window, $rootScope) {

    const SCREEN_XS_MIN = 480;
    const SCREEN_SM_MIN = 768;
    const SCREEN_MD_MIN = 992;
    const SCREEN_LG_MIN = 1200;

    const service = {};

    $rootScope.$watch(getWindowDimensions, setValues, true);

    angular.element($window)
      .bind('resize', _.throttle(() => $rootScope.$apply(), 300, {leading: false}));

    return service;

    /*
     Functions
     */

    function setValues(newValue) {
      let windowWidth = _.get(newValue, 'windowWidth');
      _.assign(service, newValue);
      _.assign(service, {

        xxsWidth: windowWidth < SCREEN_XS_MIN,
        xsWidth: windowWidth >= SCREEN_XS_MIN && windowWidth < SCREEN_SM_MIN,
        smWidth: windowWidth >= SCREEN_SM_MIN && windowWidth < SCREEN_MD_MIN,
        mdWidth: windowWidth >= SCREEN_MD_MIN && windowWidth < SCREEN_LG_MIN,
        lgWidth: windowWidth >= SCREEN_LG_MIN
      });
    }

    function getWindowDimensions() {
      return {
        windowHeight: $window.innerHeight,
        windowWidth: $window.innerWidth
      };
    }

  }

  angular.module('sistemium.services').service('saMedia', saMedia);

})();
