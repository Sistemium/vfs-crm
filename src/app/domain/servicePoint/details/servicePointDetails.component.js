(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServicePoint, FilterSystem, Brand, Person, ServiceItem, ServicePointContact} = Schema.models();

    vm.use({

      isOpenEditPopover: {},

      editItemClick,
      addItemClick,
      contactClick,
      addContractPerson,
      phoneTo,

      editServicePointClick: Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas'),
      editContractPerson: Editing.editModal('edit-service-point-contract', 'Redaguoti Naudotoją'),

    });

    refresh();

    FilterSystem.findAll();
    Brand.findAll();
    Person.findAll();

    /*
     Functions
     */

    function phoneTo(ev, phone) {
      ev.stopPropagation();
      window.open('tel:' + phone, '_self');
    }

    function addItemClick() {
      vm.newItem = ServiceItem.createInstance({servicePointId: vm.servicePoint.id});
    }

    function addContractPerson() {
      Editing.editModal('edit-service-point-contract', 'Pridėti Naudotoją Prie Aptarnavimo Taško')(ServicePointContact.createInstance({servicePointId: vm.servicePoint.id}));
    }

    function contactClick() {
      vm.clicked = !vm.clicked;
    }

    function refresh() {

      let id = $state.params.servicePointId;

      vm.rebindOne(ServicePoint, id, 'vm.servicePoint');

      let busy = [
        ServicePoint.findAllWithRelations({id}, {bypassCache: true})(['ServiceItem', 'ServicePointContact'])
          .then(loadServicePointRelations)
      ];

      vm.setBusy(busy);
    }

    function loadServicePointRelations(data) {

      let servicePoint = _.first(data);

      if (!servicePoint) return;

      _.each(servicePoint.servingItems, serviceItem => {
        serviceItem.DSLoadRelations();
      });

    }

    function editItemClick(item) {
      let popoverOpen = {};
      popoverOpen[item.id] = !vm.isOpenEditPopover[item.id];
      vm.isOpenEditPopover = popoverOpen;
    }

  }

})(angular.module('webPage'));
