(function (module) {

  module.component('personMaster', {

    // TODO: rename to personMaster
    templateUrl: 'app/domain/person/person.html',
    controller: personController,
    controllerAs: 'vm'

  });

  function personController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Person, Contact} = Schema.models();

    vm.use({
      mobileNumberMask: Person.meta.mobileNumberMask,
      $onInit,
      openModal: Editing.editModal('edit-person', 'Asmens Redagavimas'),
      addClick
    });

    Person.bindAll({
      orderBy: ['name']
    }, $scope, 'vm.persons');

    // Contact.bindAll({}, $scope, 'vm.contacts');

    /*
     Functions
     */

    function $onInit() {

      let busy = [
        Person.findAll({}, {bypassCache: true}),
        Contact.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }

    function addClick() {
      Editing.editModal('edit-person')(Person.createInstance())
    }

  }

})(angular.module('webPage'));
