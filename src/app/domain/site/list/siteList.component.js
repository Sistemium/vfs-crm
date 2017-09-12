(function (module) {

  module.component('siteList', {

    bindings: {
      sites: '='
    },

    templateUrl: 'app/domain/site/list/siteList.html',
    controller: siteListController,
    controllerAs: 'vm'

  });

  function siteListController(saControllerHelper, $scope, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      siteClick: Editing.editModal('edit-site', 'Padalinio redagavimas')
    });

  }

})(angular.module('webPage'));