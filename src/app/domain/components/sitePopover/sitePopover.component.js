(function (module) {

  module.component('sitePopover', {

    bindings: {
      current: '=?'
    },

    templateUrl: 'app/domain/components/sitePopover/site.popover.html',

    controller: sitePopoverController,
    controllerAs: 'vm'

  });

  function sitePopoverController($scope, Schema, saControllerHelper) {

    const {Site} = Schema.models();

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        optionClick
      });

    vm.rebindAll(Site, {}, 'vm.data');

    function optionClick(option) {
      vm.current = option;
      vm.popoverIsOpen = false;
    }

  }


})(angular.module('webPage'));