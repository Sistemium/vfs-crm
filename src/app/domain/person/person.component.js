(function (module) {

  module.component('person', {

    templateUrl: 'app/domain/person/person.html',
    controller: personController,
    controllerAs: 'vm'

  });

  function personController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Person} = Schema.models();

    vm.use({
      $onInit,
      openModal: Editing.editModal('edit-person', 'Asmens Redagavimas'),
      addClick
    });

    Person.bindAll({
      orderBy: ['name']
    }, $scope, 'vm.persons');

    /*
     Functions
     */

    function $onInit() {

      let busy = [
        Person.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }

    function addClick() {
      Editing.editModal('edit-person', 'Naujas Asmuo')(Person.createInstance())
    }

  }

})(angular.module('webPage'));
