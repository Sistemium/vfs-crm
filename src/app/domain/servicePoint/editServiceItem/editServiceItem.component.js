(function (module) {

  module.component('editServiceItem', {

    bindings: {
      serviceItem: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServiceItem/editServiceItem.html',
    controllerAs: 'vm',
    controller: editServiceItem

  });

  function editServiceItem(ReadyStateHelper, $scope, $timeout) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'serviceItem')
      .use({
        deleteServiceClick
      });

    vm.watchScope('vm.serviceItem.id', onServiceItemChange);

    /*
    Functions
     */

    function deleteServiceClick(service) {

      let promise = (vm.deleteConfirm === service.id) ?
        service.DSDestroy().then(onServiceItemChange) :$timeout(2000);

      vm.deleteConfirm = service.id;

      promise.then(() => vm.deleteConfirm === service.id && (vm.deleteConfirm = false));

    }

    function onServiceItemChange() {

      if (!vm.serviceItem) {
        vm.serviceItemServices = false;
        return;
      }

      vm.serviceItem.DSLoadRelations('ServiceItemService')
        .then(() => vm.serviceItemServices = _.sortBy(vm.serviceItem.services, 'date'));
    }

  }

})(angular.module('webPage'));
