'use strict';

(function () {

    angular.module('core.services').service('BarCodeScanner', function ($window) {

      return {

        bind: function (scanFn, powerFn) {

          function scanProcessor (code, type, obj) {
            scanFn (code, type, obj);
          }

          function barCodeScannerPowerFn () {
            powerFn ();
          }

          $window.barCodeScannerFn = scanProcessor;
          $window.barCodeScannerPowerFn = barCodeScannerPowerFn;

          if ($window.webkit) {
            $window.webkit.messageHandlers.barCodeScannerOn.postMessage({
              scanCallback: 'barCodeScannerFn',
              powerButtonCallback: 'barCodeScannerPowerFn'
            });
            return true;
          }

        }

      };

    });

})();
