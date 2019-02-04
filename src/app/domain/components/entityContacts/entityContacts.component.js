(function (module) {

  module.component('entityContacts', {

    bindings: {
      entity: '<',
      saveFn: '=',
      source: '@',
      isValid: '=',
      hasChanges: '=',
    },

    templateUrl: 'app/domain/components/entityContacts/entityContacts.html',
    controller: entityContactsController,
    controllerAs: 'vm'

  });

  function entityContactsController(Schema, $scope, $timeout, toastr, saEtc, $q) {


    const { ContactMethod, Contact } = Schema.models();

    const vm = _.assign(this, {

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
      onPasteFirstName,
      onEnterPress,
      deleteContactClick,
      onInputBlur: addAddress,
      currentInputMask,
      contactEditClick

    });

    $scope.$watch('vm.phone.address', onPhoneChange);

    function $onInit() {

      ContactMethod.findAll({ orderBy: [['code', 'DESC']] })
        .then(res => {
          vm.contactMethods = res;
          _.each(res, method => {

            vm[method.code] = Contact.createInstance({
              contactMethodId: method.id,
              source: 'Person'
            });

          });
        });

      vm.saveFn = saveFn;
      vm.hasChanges = hasChanges;
      vm.isValid = isValid;

      if (vm.entity.id) {
        findContacts();
      }

    }

    /*
     Functions
     */

    function saveFn(res) {

      let { id } = res;

      let unsaved = unsavedContacts();

      return $q.all(_.map(unsaved, contact => {
        contact.source = vm.source;
        contact.ownerXid = id;
        return contact.DSCreate();
      }));

    }

    function currentInputMask(contactMethod) {
      return contactMethod.code === 'email' ? contactMethod.mask : vm.pastePhone ? vm.phonePasteMask : contactMethod.mask;
    }

    function hasChanges() {
      return unsavedContacts().length ||
        (vm.phone && vm.phone.address && !vm.phone.id) ||
        (vm.email && vm.email.address && !vm.email.id);
    }

    function unsavedContacts() {

      let res = [];

      _.each(vm.contactsByCode, (contacts, code) => {

        _.each(contacts, contact => {
          if (!contact.id || contact.DSHasChanges()) {
            res.push(contact);
          }
        });

        let unsaved = vm[code];

        if (unsaved && !unsaved.id && unsaved.isValid()) {
          res.push(unsaved);
        }

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
        vm.phone.address = null;
        return;
      }

      if (value.length > 8) {
        vm.phone.address = nv.slice(-8);
      } else {
        vm.phone.address = value;
      }

    }

    function findContacts() {
      Contact.findAll({ ownerXid: vm.entity.id }, { bypassCache: true })
        .then(res => {

          if (!res.length) {
            return;
          }

          vm.contacts = res;
          vm.contactsByCode = _.groupBy(res, contact => contact.contactMethod.code);

        });
    }

    function isValid() {
      return vm.entity.isValid() &&
        isValidAddress('phone', _.get(vm.phone, 'address')) &&
        isValidAddress('email', _.get(vm.email, 'address'));
    }

    // const infoRe = /[^\d]+$/;

    function onPaste(contactMethod, ev) {

      let { code } = contactMethod;

      if (code === 'phone') {
        vm.pastePhone = true;
      }

      $timeout().then(() => {

        onEnterPress(ev, contactMethod);

      });

    }

    function onPasteFirstName() {
      $timeout()
        .then(() => vm.entity.setNames(vm.entity.firstName));
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
          vm.entity.refreshCache();
        })

    }

    function toggleErrorClass(code, error) {

      if (error) {
        console.warn('non-unique address', code, error);
      }

      vm.errorsByCode[code] = error;

    }

    function isUniqueAddress(code, address) {
      let data = vm.contactsByCode[code];
      return !_.find(data, { address });
    }

    function isValidAddress(code, address) {

      if (!address) {
        return true;
      }

      return _.find(vm.contactMethods, { code }).isValidAddress(address) &&
        (vm[code].id || isUniqueAddress(code, address));

    }

    function addAddress(contactMethod) {

      let { code, id: contactMethodId } = contactMethod;

      if (!vm[code]) {
        return;
      }

      let { address, id } = vm[code];

      toggleErrorClass(code);

      if (!address) {
        console.warn('addAddress empty');
        return;
      }

      if (!contactMethod.isValidAddress(address)) {
        return toggleErrorClass(code, 'invalid address');
      }

      if (!id && !isUniqueAddress(code, address)) {
        return toggleErrorClass(code, 'non-unique address');
      }

      let contact = vm[code];

      if (!vm.contactsByCode[code]) {
        vm.contactsByCode[code] = [];
      }

      // FIXME: find if it's already there
      !id && vm.contactsByCode[code].push(contact);

      vm[code] = Contact.createInstance({ address: null, info: null, contactMethodId });

    }

    const nameRe = /[^-]+$/;

    function onEnterPress(ev, contactMethod) {

      let { id = '' } = ev.target;

      let name = _.first(id.match(nameRe));

      if (!name) {
        return;
      }

      if (name === 'address') {
        return saEtc.focusElementById(_.replace(id, nameRe, 'info'));
      }

      addAddress(contactMethod);

      return saEtc.focusElementById(_.replace(id, nameRe, 'address'));

    }

    function contactEditClick(contact) {
      let { code } = contact.contactMethod;
      vm[code] = contact;
    }


  }

})(angular.module('webPage'));