(function (module) {

  module.component('filterSystemTypeMaster', {

    templateUrl: 'app/domain/filterSystemType/filterSystemTypeMaster.html',
    controller: filterSystemTypeMasterController,
    controllerAs: 'vm'

  });

  function filterSystemTypeMasterController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {FilterSystemType} = Schema.models();

    vm.use({
      $onInit
    });

    vm.rebindAll(FilterSystemType, {orderBy: ['name']}, 'vm.filterSystemTypes', onSearch);
    vm.watchScope('vm.searchText', onSearch);

    /*
     Functions
     */

    function onSearch() {

      let {searchText} = vm;
      vm.filterSystemTypesFiltered = filterFilterSystemTypes(vm.filterSystemTypes, searchText);

    }

    function filterFilterSystemTypes(data, text) {

      if (!text) return data;

      let re = new RegExp(_.escapeRegExp(text), 'i');

      return _.filter(data, item => re.test(item.name));

    }

    function $onInit() {
      refresh();
    }

    function refresh() {

      let busy = [
        FilterSystemType.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }
  }

})(angular.module('webPage'));