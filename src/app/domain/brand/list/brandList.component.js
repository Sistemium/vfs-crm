(function (module) {

  module.component('brandList', {

    bindings: {
      brands: '='
    },

    templateUrl: 'app/domain/brand/list/brandList.html',
    controller: brandListController,
    controllerAs: 'vm'

  });

  function brandListController(saControllerHelper, $scope, Editing) {
    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      openModal: Editing.editModal('edit-brand', 'Prekės Ženklo Redagavimas')
    });
  }

})(angular.module('webPage'));
