(function (module) {

  module.component('filterSystemTypeList', {

    bindings: {
      filterSystemTypes: '='
    },

    templateUrl: 'app/domain/filterSystemType/list/filterSystemTypeList.html',
    controller: filterSystemTypeListController,
    controllerAs: 'vm'

  });

  function filterSystemTypeListController(Editing, saControllerHelper, $scope) {
    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      openModal: Editing.editModal('edit-filter-system-type', 'Filtravimo Sistemos Tipo Redagavimas')
    });

  }

})(angular.module('webPage'));