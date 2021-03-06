(function (module) {

  module.component('brandMaster', {

    templateUrl: 'app/domain/brand/brandMaster.html',
    controller: brandMasterController,
    controllerAs: 'vm'

  });

  function brandMasterController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Brand} = Schema.models();

    vm.use({
      $onInit,
      addClick
    });

    vm.rebindAll(Brand, {orderBy: ['name']}, 'vm.brands', onSearch);
    vm.watchScope('vm.searchText', onSearch);

    /*
     Functions
     */

    function onSearch() {

      let {searchText} = vm;
      vm.brandsFiltered = filterBrands(vm.brands, searchText);

    }

    function addClick() {
      Editing.editModal('edit-brand', 'Naujas Prekės Ženklas')(Brand.createInstance());
    }

    function filterBrands(data, text) {

      if (!text) return data;

      let re = new RegExp(_.escapeRegExp(text), 'i');

      return _.filter(data, item => re.test(item.name));

    }

    function $onInit() {
      refresh();
    }

    function refresh() {

      let busy = [
        Brand.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }
  }

})(angular.module('webPage'));