(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, $uibModal) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServicePoint, FilterSystem, Brand, Person} = Schema.models();

    vm.use({
      editItem,
      openEditItemModal
    });

    refresh();

    FilterSystem.findAll();
    Brand.findAll();
    Person.findAll();

    /*
     Functions
     */

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

      console.warn(servicePoint);

    }

    function openEditItemModal(point) {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'app/domain/servicePoint/editItem/editItem.html',
        size: 'lg',
        controller: function () {
          let vm = this;
          vm.point = point;
        },
        controllerAs: 'vm'
      });
    }

    function editItem(point) {
      console.log(point);
      vm.currentPointEdit = point;
      vm.openComponent = true;
      //openEditItemModal(point);
    }

  }

})(angular.module('webPage'));
