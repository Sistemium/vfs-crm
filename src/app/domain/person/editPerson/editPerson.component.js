(function (module) {

  module.component('editPerson', {

    bindings: {
      person: '='
    },

    templateUrl: 'app/domain/person/editPerson/editPerson.html',
    controller: editPersonController,
    controllerAs: 'vm'

  });

  function editPersonController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({});

    /*
     Functions
     */

  }

})(angular.module('webPage'));
