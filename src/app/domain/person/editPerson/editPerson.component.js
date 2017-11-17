(function (module) {

  module.component('editPerson', {

    bindings: {
      person: '=ngModel',
      readyState: '=',
      saveFn: '='
    },

    templateUrl: 'app/domain/person/editPerson/editPerson.html',
    controller: editPersonController,
    controllerAs: 'vm'

  });

  function editPersonController($scope, ReadyStateHelper, Schema, $timeout, toastr, $q) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'person');
    const {Person, ContactMethod, Contact} = Schema.models();

    vm.use({

      phonePasteMask: '***********',
      maskOptions: {
        allowInvalidValue: true
      },

      contactsByCode: {
        phone: [],
        email: []
      },

      $onInit,
      onPaste,
      onEnterPress,
      deleteContactClick,
      onInputBlur

    });

    $scope.$watch('vm.phone', (nv, ov) => {

      vm.paste = false;

      if (!nv) {
        return;
      }

      if (nv !== ov) {

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

    });

    /*
     Functions
     */

    function onInputBlur(contactMethod) {

      let {code, contactRegExp} = contactMethod;

      if (!vm[code]) {
        return;
      }

      let isDuplicate = _.find(vm.contactsByCode[code], {address: vm[code]});

      if (contactRegExp.test(vm[code]) && !isDuplicate) {

        let contact = Contact.createInstance({address: vm[code], ownerXid: vm.person.id || null});
        vm.contactsByCode[code].push(contact);

      }

      vm[code] = null;

    }

    function saveFn() {
      return Person.create(vm.person)
        .then((res) => {
          return saveContact('email', res.id)
            .then(res => {
              console.log(res);
            })
            .then(() => res);

        })
        .then((res) => {
          return saveContact('phone', res.id)
            .then((res) => {
              console.log(res);
            });
        })

    }

    function saveContact(contactMethod, personId, address) {

      let promises = [];
      let contactsArr = [];

      if (address) {

        let itemInstance = Contact.createInstance({address});
        contactsArr.push(itemInstance);

      } else {
        contactsArr = vm.contactsByCode[contactMethod];
      }

      _.map(contactsArr, (item) => {

        if (item) {
          console.log(item);
        }

        if (item.id) {
          return;
        }

        let newContact = Contact.create({
          ownerXid: personId || null,
          address: item.address,
          source: 'Person',
          contactMethodId: _.find(vm.contactMethods, {code: contactMethod}).id
        });

        promises.push(newContact);

      });

      return $q.all(promises);

    }

    function findContacts() {
      Contact.findAll({ownerXid: vm.person.id}, {bypassCache: true})
        .then((res) => {

          if (!res.length) {
            return;
          }

          vm.contacts = res;
          vm.contactsByCode = _.groupBy(res, contact => contact.contactMethod.code);

        });
    }

    function $onInit() {

      ContactMethod.findAll().then((res) => {
        vm.contactMethods = res;
      });

      vm.saveFn = saveFn;

      if (vm.person.id) {
        findContacts();
      }

    }

    function onPaste(code) {
      if (code === 'phone') {
        vm.paste = true;
      }
    }

    function deleteContactClick(item, code) {

      let arr = vm.contactsByCode[code];

      let itemToDelete = _.find(arr, item);

      if (itemToDelete) {
        _.remove(arr, itemToDelete);
      }

      if (vm.person.id) {

        Contact.destroy(itemToDelete)
          .then(() => {
            toastr.success(`${item.contactMethod.name} ištrintas`);
          })
          .catch((err) => {
            console.error(err);
            toastr.error('Ištrinti nepavyko')
          })

      }

    }

    function toggleErrorClass(query) {

      let elem = angular.element(document.querySelector(query));
      elem.addClass('error-on-input');

      $timeout(() => {
        elem.removeClass('error-on-input');
      }, 1000)

    }

    function onEnterPress(ev, contactMethod) {

      let keyCode = ev.which || ev.keyCode || 0;

      if (keyCode !== 13) {
        return;
      }

      let {code, contactRegExp} = contactMethod;

      let address = vm[code];

      if (contactRegExp.test(address)) {

        if (_.find(vm.contactsByCode[code], {address})) {
          toggleErrorClass(`#${code}`);
          return;
        }

        if (vm.person.id) {

          saveContact(code, vm.person.id, address)
            .then(() => {
              vm[code] = null;
              findContacts()
            });

        } else {
          let contact = Contact.createInstance({address});
          vm.contactsByCode[code].push(contact);
        }

        address = null;

      } else {

        toggleErrorClass(`#${code}`);

      }

    }

  }

})(angular.module('webPage'));