(function (module) {

  module.component('editPerson', {

    bindings: {
      person: '='
    },

    templateUrl: 'app/domain/person/editPerson/editPerson.html',
    controller: editPersonController,
    controllerAs: 'vm'

  });

  function editPersonController($scope, saControllerHelper, Schema) {

    const vm = saControllerHelper.setup(this, $scope);
    const {Person} = Schema.models();

    vm.use({
      mobileNumberMask: Person.meta.mobileNumberMask
    });

    /*
     Functions
     */

  }

})(angular.module('webPage'));
