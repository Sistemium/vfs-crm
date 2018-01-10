(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'servicePlanning',
          url: '/servicePlanning',
          template: '<service-planning></service-planning>',

          data: {
            title: 'Aptarnavimų planavimas'
          }

        });

    });

})();