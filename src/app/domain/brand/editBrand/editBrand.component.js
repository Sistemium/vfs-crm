(function (module) {

  module.component('editBrand', {

    bindings: {
      brand: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/brand/editBrand/editBrand.html',
    controller: editBrandController,
    controllerAs: 'vm'

  });

  function editBrandController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'brand');
  }

})(angular.module('webPage'));
