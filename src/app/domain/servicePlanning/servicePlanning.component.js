(function () {

  angular.module('webPage')
    .component('servicePlanning', {

      templateUrl: 'app/domain/servicePlanning/servicePlanning.html',
      controller: servicePlanningController,
      controllerAs: 'vm'

    });

  function servicePlanningController($scope, saControllerHelper, Schema, moment, Editing) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        monthDate: new Date(moment().format('YYYY.MM')),
        filterSystemClick,
        servicePointClick
      });

    const {
      ServicePlanning, Employee, Person, FilterSystem, Brand, ServicePoint, ServiceItem, ServiceContract, LegalEntity
    } = Schema.models('');

    vm.watchScope('vm.monthDate', () => {
      vm.month = moment(vm.monthDate).format();
    });

    vm.watchScope('vm.month', onMonthChange);

    /*
    Functions
     */

    function servicePointClick(item) {
      Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas')(item.serviceItem.servicePoint);
    }

    function filterSystemClick(item) {
      Editing.editModal('edit-service-item', 'Redaguoti Įrenginį')(item.serviceItem);
    }

    function onMonthChange() {
      console.info(vm.month);
      if (vm.month) {
        refresh();
      }
    }

    function refresh() {

      let monthEnd = moment(vm.monthDate).add(1, 'month').add(-1, 'day').format();

      let where = {
        nextServiceDate: {'<=': monthEnd}
      };

      let busy = [
        Employee.findAll(),
        Person.findAll(),
        FilterSystem.findAll(),
        Brand.findAll(),
        ServicePoint.findAll(),
        ServiceContract.findAll(),
        LegalEntity.findAll(),
        ServiceItem.findAll(),
        ServicePlanning.findAllWithRelations({where}, {bypassCache: true})('ServiceItem')
      ];

      return vm.setBusy(busy)
        .then(() => {
          vm.rebindAll(ServicePlanning, {where}, 'vm.data', groupByServingMaster);
        });

    }

    function groupByServingMaster() {

      let groups = _.groupBy(vm.data, 'servingMasterId');
      let res = [];

      _.each(groups, (data, servingMasterId) => {

        res.push({
          cls: 'group',
          id: servingMasterId,
          servingMaster: Employee.get(servingMasterId)
        });

        data = _.sortBy(data, 'nextServiceDate');

        res.push(...data);

      });

      vm.groupedData = res;

    }

  }


})();