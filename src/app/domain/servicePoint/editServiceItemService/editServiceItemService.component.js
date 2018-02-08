(function (module) {

  const component = {

    bindings: {
      serviceItemService: '=ngModel',
      saveFn: '=',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServiceItemService/editServiceItemService.html',
    controller: editServiceItemServiceController,
    controllerAs: 'vm'

  };

  module
    .component('editServiceItemService', component)
    .component('showServiceItemService', _.defaults({
      controller: null,
      templateUrl: 'app/domain/servicePoint/editServiceItemService/showServiceItemService.html'
    }, component));

  /** @ngInject */
  function editServiceItemServiceController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'serviceItemService');
  }

})(angular.module('webPage'));