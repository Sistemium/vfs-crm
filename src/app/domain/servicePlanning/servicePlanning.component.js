(function () {

  angular.module('webPage')
    .component('servicePlanning', {

      templateUrl: 'app/domain/servicePlanning/servicePlanning.html',
      controller: servicePlanningController,
      controllerAs: 'vm'

    });

  function servicePlanningController($scope, saControllerHelper) {

    saControllerHelper.setup(this, $scope);

  }


})();