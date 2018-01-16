'use strict';

/* global moment:false uuid:false geolib:false XLSX:false */
(function () {


  const localDev = !!location.port;

  const authUrl = 'https://oauth.it';
  // authUrl = localDev ? 'http://localhost:9080' :  authUrl;

  angular
    .module('webPage')

    .constant('moment', moment)
    .constant('UUID', uuid)
    .constant('XLSX', XLSX)
    .constant('geolib', geolib)

    .constant('saaAppConfig', {
      loginState: 'login',
      authUrl: authUrl,
      authApiUrl: authUrl + '/api/',
      redirect_uri: localDev ? 'http://localhost:3100' : 'https://vfs.sistemium.com',
      orgAppId: localDev ? '141731ce-93e4-11e7-8000-81ed4ca6ee78' : '16c5fe1e-93e4-11e7-8000-81ed4ca6ee78'
    })

    .value('cgBusyDefaults', {
      message: 'Puslapis kraunasi',
      delay: 100,
      templateUrl: 'app/components/busy/busy.html'
    })

    .config(uibDatepickerPopupConfig => {
      _.assign(uibDatepickerPopupConfig, {
        datepickerPopupTemplateUrl: 'app/domain/components/datePicker/datePickerPopup.html',
        currentText: 'Šiandien',
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
