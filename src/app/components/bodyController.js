'use strict';

(function () {

  angular.module('webPage').controller('BodyController', function (appcache, toastr, $window) {

    const vm = this;
    const ua = new UAParser();
    const deviceInfo = ua.getOS();

    vm.cls = deviceInfo.name ? deviceInfo.name.replace(' ', '') : '';
    vm.cacheStatus = function () {
      return appcache.textStatus;
    };

    function onUpdate() {
      toastr.error('Paspauskite, kad taikyti', 'Gautas atnaujinimas', {
        timeOut: 0,
        extendedTimeOut: 0,
        onTap: function () {
          $window.location.reload(true);
        }
      });
    }

    $window.stmAppCacheUpdated = onUpdate;

    appcache.addEventListener('updateready', onUpdate, true);

  });

})();
