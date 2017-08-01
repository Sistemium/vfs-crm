(function (module) {

  module.component('siteMaster', {

    templateUrl: 'app/domain/site/siteMaster.html',
    controller: siteMasterController,
    controllerAs: 'vm'

  });

  function siteMasterController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Site} = Schema.models();

    vm.use({
      $onInit
    });

    vm.rebindAll(Site, {orderBy: ['name']}, 'vm.sites', onSearch);
    vm.watchScope('vm.searchText', onSearch);

    /*
     Functions
     */

    function onSearch() {

      let {searchText} = vm;
      vm.sitesFiltered = filterFilterSystemTypes(vm.sites, searchText);

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
        Site.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }
  }

})(angular.module('webPage'));