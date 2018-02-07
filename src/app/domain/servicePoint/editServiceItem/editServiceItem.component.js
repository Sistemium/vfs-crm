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

    ReadyStateHelper.setupController(this, $scope, 'serviceItem');

  }

})(angular.module('webPage'));
