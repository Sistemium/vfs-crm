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

  function servicePlanningController($scope, saControllerHelper, Schema, moment, Editing,
                                     ExportConfig, ExportExcel, $filter, $q) {

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

    const ltphone = $filter('ltphone');

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
        let {filterSystem, servicePoint} = serviceItem;
        let {servicePrice} = serviceItem;

        servicePrice = servicePrice || filterSystem.servicePrice || filterSystem.filterSystemType.servicePrice;

        let customer = servicePoint.currentServiceContract.customer();
        let allPhones = _.clone(customer.allPhones()) || [];

        _.each(servicePoint.servicePointContacts, contact => {
          allPhones.push(...contact.person.allPhones());
        });

        let contacts = _.map(allPhones, phone => ltphone(phone.address)).join('\r');

        return _.defaults({

          lastServiceDate: moment(item.lastServiceDate).toDate(),
          servicePoint,
          serviceItem,
          filterSystem,
          customer,
          servicePrice,
          contacts

        }, item);

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
        Person.findAll(),
        LegalEntity.findAll(),
        FilterSystem.findAll(),
        Brand.findAll(),
        Employee.findAll(),
        ServicePoint.findAll({siteId}),
        ServiceContract.findAll({siteId}),
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

      let busy = [];

      _.each(groups, (data, servingMasterId) => {

        data = _.sortBy(data, 'nextServiceDate');

        _.each(data, item => {

          let servicePointContacts = item.serviceItem.servicePoint.DSLoadRelations('ServicePointContact')
            .then(servicePoint => {
              busy.push(servicePoint.currentServiceContract.customer().contactsLazy());
              return $q.all(_.map(servicePoint.servicePointContacts, contact => contact.person.contactsLazy()));
            });

          busy.push(servicePointContacts);

        });

        res.push({
          cls: 'group',
          id: servingMasterId,
          servingMaster: Employee.get(servingMasterId),
          data
        });

        res.push(...data);

      });

      vm.setBusy(busy);

      vm.groupedData = res;

    }

  }


})();