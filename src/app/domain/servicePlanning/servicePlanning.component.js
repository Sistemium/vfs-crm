(function () {

  angular.module('webPage')
    .component('servicePlanning', {

      templateUrl: 'app/domain/servicePlanning/servicePlanning.html',
      controller: servicePlanningController,
      controllerAs: 'vm'

    });

  function servicePlanningController($scope, saControllerHelper, Schema, moment) {

    const monthFormat = 'YYYY.MM';

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        monthFormat,
        monthDate: new Date(moment().format())
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
          vm.rebindAll(ServicePlanning, {where}, 'vm.data');
        });

    }

  }


})();