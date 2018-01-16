(function () {

  angular.module('webPage')
    .component('servicePlanning', {

      bindings: {
        month: '='
      },

      templateUrl: 'app/domain/servicePlanning/servicePlanning.html',
      controller: servicePlanningController,
      controllerAs: 'vm'

    });

  function servicePlanningController($scope, saControllerHelper, Schema, moment, Editing, ExportConfig, ExportExcel) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        monthDate: new Date(this.month),
        filterSystemClick,
        servicePointClick,
        exportClick
      });

    const {
      ServicePlanning, Employee, Person, FilterSystem, Brand, ServicePoint,
      ServiceItem, ServiceContract, LegalEntity,
      Site
    } = Schema.models('');

    vm.watchScope('vm.monthDate', () => {
      vm.month = moment(vm.monthDate).format('YYYY-MM');
    });

    vm.watchScope('vm.month', onMonthChange);
    vm.watchScope(() => _.get(Site.meta.getCurrent(), 'id'), onMonthChange);

    /*
    Functions
     */

    function exportClick(group) {

      let {data} = group;
      let name = `${vm.month} - ${group.servingMaster.name}`;

      data = _.map(data, item => {

        let {serviceItem} = item;
        let {filterSystem} = serviceItem;
        let {servicePrice = filterSystem.servicePrice || filterSystem.filterSystemType.servicePrice} = serviceItem;

        return _.assign(item, {
          customerName: serviceItem.servicePoint.currentServiceContract.customer().name,
          servicePrice,
          lastServiceDateLT: moment(item.lastServiceDate).toDate()
        });

      });

      ExportExcel.exportArrayWithConfig(data, ExportConfig.ServicePlanning, name);

    }

    function servicePointClick(item) {
      Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas')(item.serviceItem.servicePoint);
    }

    function filterSystemClick(item) {
      Editing.editModal('edit-service-item', 'Redaguoti Įrenginį')(item.serviceItem)
        .then(item => item.id && ServicePlanning.find(item.id, {bypassCache: true}));
    }

    function onMonthChange() {
      console.info(vm.month);
      if (vm.month && Site.meta.getCurrent()) {
        refresh();
      }
    }

    function refresh() {

      let siteId = Site.meta.getCurrent().id;
      let monthEnd = moment(vm.monthDate).add(1, 'month').add(-1, 'day').format();

      let where = {
        siteId: {'==': siteId},
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

        data = _.sortBy(data, 'nextServiceDate');

        res.push({
          cls: 'group',
          id: servingMasterId,
          servingMaster: Employee.get(servingMasterId),
          data
        });

        res.push(...data);

      });

      vm.groupedData = res;

    }

  }


})();