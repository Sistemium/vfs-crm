(function (module) {

  module.component('editServiceItemService', {

    bindings: {
      serviceItemService: '=ngModel',
      saveFn: '=',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServiceItemService/editServiceItemService.html',
    controller: editServiceItemServiceController,
    controllerAs: 'vm'

  });

  function editServiceItemServiceController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'serviceItemService');
  }

})(angular.module('webPage'));