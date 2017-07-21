(function (module) {

  module.component('navigationBar', {

    bindings: {
      viewButtons: '@',
      searchText: '=?',
      stateName: '@'
    },

    templateUrl: 'app/domain/components/navigationBar/navigationBar.html',
    controller: navigationBarController,
    controllerAs: 'vm'

  });

  function navigationBarController($scope, saControllerHelper, $state, $uibModal) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      goToTable,
      goToTiles,
      addItem,
      active: 'tiles'
    });

    /*
     Functions
     */

    function addItem() {
      openEditItemModal()
    }

    function openEditItemModal(point) {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'app/domain/components/navigationBar/newServicePoint.html',
        size: 'lg',
        controller: function () {
          let vm = this;
          vm.point = point;
        },
        controllerAs: 'vm'
      });
    }

    function goToTiles() {
      $state.go(vm.stateName + '.tiles');
      vm.active = 'tiles'
    }

    function goToTable() {
      $state.go(vm.stateName + '.table');
      vm.active = 'table'
    }

  }

})(angular.module('webPage'));
