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
      mobileNumberMask: Person.meta.mobileNumberMask,
      phonePasteMask: '***********',
      maskOptions: {
        allowInvalidValue: true
      }
    });

    /*
     Functions
     */

    $scope.$watch('vm.person.phone', (nv, ov) => {

      vm.paste = false;

      if (!nv) {
        return;
      }

      if (nv !== ov) {

        let value = nv.replace(/[^0-9]/gi, '');

        if (!value) {
          vm.person.phone = null;
          return;
        }

        if (value.length > 8) {
          vm.person.phone = nv.slice(-8);
        } else {
          vm.person.phone = value;
        }

      }

    });

  }

})(angular.module('webPage'));
