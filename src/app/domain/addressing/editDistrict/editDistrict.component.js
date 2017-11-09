(function (module) {

  module.component('editDistrict', {

    bindings: {
      district: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/addressing/editDistrict/editDistrict.html',
    controllerAs: 'vm',
    controller: editDistrictController

  });

  function editDistrictController($scope, ReadyStateHelper) {
    ReadyStateHelper.setupController(this, $scope, 'district');
  }

})(angular.module('webPage'));
