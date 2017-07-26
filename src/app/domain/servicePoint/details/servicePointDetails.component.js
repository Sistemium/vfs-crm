(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing, toastr) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServicePoint, FilterSystem, Brand, Person} = Schema.models();

    vm.use({

      isOpenEditPopover: {},

      editItemCancelClick,
      editItemSaveClick,
      editItemClick,
      addItemClick,
      editServicePointClick: Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas')

    });

    refresh();

    FilterSystem.findAll();
    Brand.findAll();
    Person.findAll();

    /*
     Functions
     */

    function addItemClick() {
      console.warn('not implemented');
    }

    function editItemCancelClick(serviceItem) {
      // TODO: rewrite popoverOpen with string and watch it to revert
      if (serviceItem.id) {
        serviceItem.DSRevert();
      }
      vm.isOpenEditPopover = {};
    }

    function editItemSaveClick(serviceItem) {

      serviceItem.DSCreate()
        .then(() => vm.isOpenEditPopover = {})
        .catch(err => toastr.error(angular.toJson(err)));

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

      // console.warn(servicePoint);

    }

    function editItemClick(item) {
      let popoverOpen = {};
      popoverOpen[item.id] = !vm.isOpenEditPopover[item.id];
      vm.isOpenEditPopover = popoverOpen;
    }

  }

})(angular.module('webPage'));
