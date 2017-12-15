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

  function editLegalEntityController($scope, ReadyStateHelper, Schema, $timeout, toastr, $q) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'legalEntity');
    const {LegalEntity, ContactMethod, Contact} = Schema.models();

    vm.use({

      phonePasteMask: '***********',
      maskOptions: {
        allowInvalidValue: true
      },

      contactsByCode: {
        phone: [],
        email: []
      },

      errorsByCode: {},

      confirmDestroy: {},

      $onInit,
      onPaste,
      onEnterPress,
      deleteContactClick,
      onInputBlur: addAddress,
      hasChanges,
      currentInputMask

    });

    $scope.$watch('vm.phone', onPhoneChange);

    /*
     Functions
     */

    function currentInputMask(contactMethod) {
      return contactMethod.code === "email" ? contactMethod.mask : vm.pastePhone ? vm.phonePasteMask : contactMethod.mask;
    }

    function hasChanges() {
      return !vm.legalEntity.id || vm.legalEntity.DSHasChanges() || unsavedContacts().length || vm.phone || vm.email;
    }

    function unsavedContacts() {

      let res = [];

      _.each(vm.contactsByCode, contacts => {

        _.each(contacts, contact => {
          if (!contact.id) {
            res.push(contact);
          }
        });

      });

      return res;

    }

    function onPhoneChange(nv, ov) {

      vm.pastePhone = false;

      if (!nv || nv === ov) {
        return;
      }

      let value = nv.replace(/[^0-9]/gi, '');

      if (!value) {
        vm.phone = null;
        return;
      }

      if (value.length > 8) {
        vm.phone = nv.slice(-8);
      } else {
        vm.phone = value;
      }

    }

    function saveFn() {
      return LegalEntity.create(vm.legalEntity)
        .then(res => {

          let {id} = res;

          let unsaved = unsavedContacts();

          return $q.all(_.map(unsaved, contact => {
            contact.ownerXid = id;
            return contact.DSCreate();
          }));

        })
        .then(() => {
          vm.legalEntity.refreshCache();
          return vm.legalEntity;
        });

    }

    function findContacts() {
      Contact.findAll({ownerXid: vm.legalEntity.id}, {bypassCache: true})
        .then(res => {

          if (!res.length) {
            return;
          }

          vm.contacts = res;
          vm.contactsByCode = _.groupBy(res, contact => contact.contactMethod.code);

        });
    }

    function $onInit() {

      ContactMethod.findAll()
        .then(res => {
          vm.contactMethods = res;
        });

      vm.saveFn = saveFn;
      vm.hasChanges = hasChanges;
      vm.isValid = isValid;

      if (vm.legalEntity.id) {
        findContacts();
      }

    }

    function isValid() {
      return vm.legalEntity.isValid() && isValidAddress('phone', vm.phone) && isValidAddress('email', vm.email);
    }

    function onPaste(contactMethod) {

      if (contactMethod.code === 'phone') {
        vm.pastePhone = true;
      }

      $timeout().then(() => addAddress(contactMethod));

    }

    function deleteContactClick(item, code) {

      let itemAddress = item.address;

      if (item.id) {
        vm.confirmDestroy[itemAddress] = !vm.confirmDestroy[itemAddress];

        if (vm.confirmDestroy[itemAddress]) {
          return $timeout(2000)
            .then(() => delete vm.confirmDestroy[itemAddress]);
        }
      }

      let contacts = vm.contactsByCode[code];

      _.remove(contacts, item);

      if (!item.id) {
        return;
      }

      Contact.destroy(item)
        .then(() => {
          toastr.success(`${item.contactMethod.name} ištrintas`);
        })
        .catch((err) => {
          console.error(err);
          toastr.error('Ištrinti nepavyko')
        })
        .finally(() => {
          vm.readyToDelete = false;
        })

    }

    function toggleErrorClass(code, error) {

      if (error) {
        console.warn('non-unique contact', code, error);
      }

      vm.errorsByCode[code] = error;

    }

    function isUniqueAddress(code, address) {
      let data = vm.contactsByCode[code];
      return !_.find(data, {address});
    }

    function isValidAddress(code, address) {

      if (!address) {
        return true;
      }

      return _.find(vm.contactMethods, {code}).isValidAddress(address) && isUniqueAddress(code, address);

    }

    function addAddress(contactMethod) {

      let {code} = contactMethod;

      let address = vm[code];

      toggleErrorClass(code);

      if (!address) {
        console.warn('addAddress empty');
        return;
      }

      if (!contactMethod.isValidAddress(address)) {
        return toggleErrorClass(code, 'invalid address');
      }

      if (!isUniqueAddress(code, address)) {
        return toggleErrorClass(code, 'non-unique address');
      }

      let contact = Contact.createInstance({
        contactMethodId: contactMethod.id,
        address,
        ownerXid: vm.legalEntity.id || null,
        source: 'LegalEntity'
      });

      if (!vm.contactsByCode[code]) {
        vm.contactsByCode[code] = [];
      }

      vm.contactsByCode[code].push(contact);

      vm[code] = null;

    }

    function onEnterPress(ev, contactMethod) {

      let keyCode = ev.which || ev.keyCode || 0;

      if (keyCode !== 13) {
        return;
      }

      addAddress(contactMethod);

    }

  }

})(angular.module('webPage'));
