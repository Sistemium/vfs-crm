(function (module) {

  module.component('editLegalEntity', {

    bindings: {
      legalEntity: '=ngModel',
      readyState: '=',
      // ????????????
      saveFn: '=?',
      hasChanges: '=?',
      isValid: '=?'
    },

    templateUrl: 'app/domain/legalEntity/editLegalEntity/editLegalEntity.html',
    controller: editLegalEntityController,
    controllerAs: 'vm'

  });

  function editLegalEntityController($scope, ReadyStateHelper, Schema) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'legalEntity');
    const { LegalEntity } = Schema.models();

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
      return !vm.legalEntity.id || vm.legalEntity.DSHasChanges() || vm.contactsHasChanges();
    }

    function isValid() {
      return vm.legalEntity.isValid() && vm.contactsIsValid();
    }

    function saveFn() {
      return LegalEntity.create(vm.legalEntity)
        .then(vm.saveContacts)
        .then(() => {
          vm.legalEntity.refreshCache();
          return vm.legalEntity;
        });

    }

  }

})(angular.module('webPage'));
