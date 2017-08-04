(function (module) {

  module.component('filterSystemMaster', {

    templateUrl: 'app/domain/filterSystem/filterSystemMaster.html',
    controller: filterSystemMasterController,
    controllerAs: 'vm'

  });

  function filterSystemMasterController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Brand, FilterSystemType, FilterSystem} = Schema.models();

    vm.use({
      $onInit,
      openModal: Editing.editModal('edit-filter-system', 'Filtravimo Sistemos Redagavimas'),
      addClick
    });

    vm.rebindAll(Brand, {orderBy: ['name']}, 'vm.brands');

    /*
     Functions
     */

    function $onInit() {

      let busy = [
        FilterSystemType.findAll({}, {bypassCache: true}),
        FilterSystem.findAll({}, {bypassCache: true}),
        Brand.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }

    function addClick() {
      Editing.editModal('edit-filter-system', 'Nauja Filtravimo Sistema')(FilterSystem.createInstance())
    }

  }

})(angular.module('webPage'));
