'use strict';

/* global moment:false uuid:false geolib:false */

(function () {

  angular
    .module('webPage')

    .constant('moment', moment)
    .constant('UUID', uuid)
    .constant('geolib', geolib)

    .value('cgBusyDefaults', {
      message: 'Puslapis kraunasi',
      delay: 100,
      templateUrl: 'app/components/busy/busy.html'
    })

    .config(uibDatepickerPopupConfig => {
      _.assign(uibDatepickerPopupConfig, {
        datepickerPopupTemplateUrl: 'app/domain/components/datePicker/datePickerPopup.html',
        closeText: 'Uždaryti',
        clearText: 'Ištrinti'
      });
    })

    .config($uibTooltipProvider => {
      $uibTooltipProvider.options({
        placement: 'auto bottom-left'
      });
    })

    .run(moment => {
      moment.defaultFormat = 'YYYY-MM-DD';
    })

    .run($rootScope => {
      $rootScope.datepickerOptions = {
        showWeeks: false
      };
    })

})();
