(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });


  function servicePointDetailsController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServicePoint, FilterSystem, Brand, Person} = Schema.models();

    vm.use({
      onItemHover,
      editItem
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
        serviceItem.DSLoadRelations()
          .then(() => {
            _.each(serviceItem.serviceContractItems, serviceContractItem => {
              serviceContractItem.DSLoadRelations();
            });
          });
      });

      console.warn(servicePoint);

    }

    function onItemHover(item) {

      if (item) {
        vm.currHoverId = item.id;
        vm.showIcon = true;
      } else {
        vm.currHoverId = '';
        vm.showIcon = false;
      }

    }

    function editItem(item) {

    }

  }


})(angular.module('webPage'));
