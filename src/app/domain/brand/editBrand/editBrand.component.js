(function (module) {

  module.component('editBrand', {

    bindings: {
      brand: '='
    },

    templateUrl: 'app/domain/brand/editBrand/editBrand.html',
    controller: editBrandController,
    controllerAs: 'vm'

  });

  function editBrandController() {

  }

})(angular.module('webPage'));
