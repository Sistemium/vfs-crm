(function (module) {

  module.component('editPerson', {

    bindings: {
      person: '=ngModel',
      readyState: '=',
      saveFn: '=?',
      hasChanges: '=?',
      isValid: '=?'
    },

    templateUrl: 'app/domain/person/editPerson/editPerson.html',
    controller: editPersonController,
    controllerAs: 'vm'

  });

  function editPersonController($scope, ReadyStateHelper, Schema) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'person');

    const { Person } = Schema.models();

    vm.use({

      confirmDestroy: {},

      $onInit,
      hasChanges,
      saveContacts: _.noop,
      contactsIsValid: _.noop,
      contactsHasChanges: _.noop,

    });

    function $onInit() {

      vm.saveFn = saveFn;
      vm.hasChanges = hasChanges;
      vm.isValid = isValid;

    }

    /*
     Functions
     */

    function hasChanges() {
      return !vm.person.id || vm.person.DSHasChanges() || vm.contactsHasChanges();
    }

    function saveFn() {
      return Person.create(vm.person)
        .then(vm.saveContacts)
        .then(() => {
          vm.person.refreshCache();
          return vm.person;
        });

    }

    function isValid() {
      return vm.person.isValid() && vm.contactsIsValid();
    }

  }

})(angular.module('webPage'));