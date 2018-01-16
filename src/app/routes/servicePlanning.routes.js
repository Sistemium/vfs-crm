(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'servicePlanning',
          url: '/servicePlanning?month',
          template: '<service-planning month="vm.month"></service-planning>',

          controller: servicePlanningRouterController,
          controllerAs: 'vm',

          data: {
            title: 'Aptarnavimų planavimas'
          }

        });

    });

  function servicePlanningRouterController($state, moment, $scope) {

    this.month = $state.params.month || moment().format('YYYY.MM');

    $scope.$watch('vm.month', month => {
      $state.go('.', {month}, {notify: false});
    });

  }

})();