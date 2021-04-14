(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'servicePlanning',
          url: '/servicePlanning?month&servingMasterId',
          template: '<service-planning month="vm.month" serving-master-id="vm.servingMasterId"></service-planning>',

          controller: servicePlanningRouterController,
          controllerAs: 'vm',

          data: {
            title: 'Aptarnavimų planavimas'
          }

        });

    });

  function servicePlanningRouterController($state, moment, $scope) {

    this.month = $state.params.month || moment().format('YYYY.MM');
    this.servingMasterId = $state.params.servingMasterId || null;

    $scope.$watchGroup(['vm.month', 'vm.servingMasterId'], ([month, servingMasterId]) => {
      $state.go('.', { month, servingMasterId }, { notify: false });
    });

  }

})();