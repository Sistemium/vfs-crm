'use strict';

(function () {

  angular.module('webPage')
    .service('Helpers', function(
      saControllerHelper,
      saEtc,
      ConfirmModal,
      toastr,
      ScrollHelper,
      ClickHelper,
      saMedia,
      moment
    ) {

      return {

        saControllerHelper,
        saEtc,
        ConfirmModal,
        toastr,
        ScrollHelper,
        ClickHelper,
        saMedia,
        moment

      };

    });

})();
