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

  module.component('showServiceItem', {

    bindings: {
      serviceItem: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServiceItem/showServiceItem.html',
    controllerAs: 'vm',
    controller: editServiceItem

  });

  function editServiceItem(ReadyStateHelper, $scope, $timeout, Schema) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'serviceItem')
      .use({
        deleteServiceItemServiceClick
      });

    vm.watchScope('vm.serviceItem.id', onServiceItemChange);

    /*
    Functions
     */

    function deleteServiceItemServiceClick(service) {

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

      let serviceItemId = vm.serviceItem.id;

      if (!serviceItemId) return;

      let orderBy = [['date', 'DESC']];

      vm.serviceItem.DSLoadRelations('ServiceItemService');

      vm.rebindAll(Schema.model('ServiceItemService'), {serviceItemId, orderBy}, 'vm.serviceItemServices');

    }

  }

})(angular.module('webPage'));
