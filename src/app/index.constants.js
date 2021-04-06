/* global moment:false uuid:false geolib:false XLSX:false */
(function () {

  const APPS = {
    test: {
      id: '8f334616-96c6-11eb-8000-e069958a099e',
      url: 'https://vfsd.sistemium.com',
    },
    localDev: {
      id: '141731ce-93e4-11e7-8000-81ed4ca6ee78',
      url: 'http://localhost:3100',
    },
    prod: {
      id: '16c5fe1e-93e4-11e7-8000-81ed4ca6ee78',
      url: 'https://vfs.sistemium.com',
    },
  };

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
      authUrl,
      authApiUrl: `${authUrl}/api/`,
      redirect_uri: appURL(),
      orgAppId: appId(),
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

  function appURL() {
    return APPS[appCode()].url;
  }

  function appId() {
    return APPS[appCode()].id;
  }

  function appCode() {
    if (localDev) {
      return 'localDev';
    }
    if (location.hostname.match(/^vfsd/)) {
      return 'test';
    }
    return 'prod';
  }

})();
