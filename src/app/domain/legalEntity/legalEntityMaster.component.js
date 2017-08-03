(function (module) {

  module.component('legalEntityMaster', {

    templateUrl: 'app/domain/legalEntity/legalEntityMaster.html',
    controller: legalEntityMasterController,
    controllerAs: 'vm'

  });

  function legalEntityMasterController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {LegalEntity} = Schema.models();


    vm.use({
      $onInit,
      openModal: Editing.editModal('edit-legal-entity', 'Įmonės Redagavimas'),
      addClick
    });

    vm.rebindAll(LegalEntity, {orderBy: ['name']}, 'vm.legalEntities', onSearch);
    vm.watchScope('vm.searchText', onSearch);

    /*
     Functions
     */

    function onSearch() {

      let {searchText} = vm;
      vm.legalEntitiesFiltered = filterLegalEntities(vm.legalEntities, searchText);

    }

    function filterLegalEntities(data, text) {

      if (!text) return data;

      let re = new RegExp(_.escapeRegExp(text), 'i');

      return _.filter(data, item => re.test(item.name));

    }

    function addClick() {
      Editing.editModal('edit-legal-entity', 'Nauja Įmonė')(LegalEntity.createInstance())
    }

    function $onInit() {
      refresh();
    }

    function refresh() {

      let busy = [
        LegalEntity.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }
  }

})(angular.module('webPage'));
