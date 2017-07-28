(function (module) {

  module.component('filterSystem', {

    templateUrl: 'app/domain/filterSystem/filterSystem.html',
    controller: filterSystemController,
    controllerAs: 'vm'

  });

  function filterSystemController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Brand, FilterSystemType, FilterSystem} = Schema.models();

    vm.use({
      $onInit,
      openModal: Editing.editModal('edit-filter-system', 'Filtravimo Sistemos Redagavimas'),
      addClick
    });

    Brand.bindAll({
      orderBy: ['name']
    }, $scope, 'vm.brands');

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