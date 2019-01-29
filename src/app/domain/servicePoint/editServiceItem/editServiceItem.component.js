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

  function editServiceItem(ReadyStateHelper, $scope) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'serviceItem');
    const  itemServicesDefault = {};

    _.assign(vm, {

      itemServicesDefaults() {
        return _.assign(itemServicesDefault, {
          servingMasterId: _.get(vm.serviceItem, 'servingMasterId'),
          serviceSchema: !!(_.get(vm.serviceItem, 'smallServicePrice') || _.get(vm.serviceItem, 'filterSystem.smallServicePrice')),
        });
      },

    });

  }

})(angular.module('webPage'));
