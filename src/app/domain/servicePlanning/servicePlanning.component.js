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
                                     servicePlanningExportConfig, ExportExcel, $filter, $q) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        monthDate: new Date(this.month),
        filterSystemClick,
        servicePointClick,
        exportClick,
        exportAllClick,
        saveItemService
      });

    const {
      ServicePlanning, Employee, Person, FilterSystem, Brand, ServicePoint,
      ServiceItem, ServiceContract, LegalEntity,
      Site, District, ServiceItemService
    } = Schema.models('');

    const ltphone = $filter('ltphone');

    const exportConfig = servicePlanningExportConfig.ServicePlanning;

    vm.watchScope('vm.monthDate', () => {
      vm.month = moment(vm.monthDate).format('YYYY-MM');
    });

    vm.watchScope('vm.month', onMonthChange);
    vm.watchScope(() => _.get(Site.meta.getCurrent(), 'id'), onMonthChange);

    /*
    Functions
     */

    function saveItemService(item) {

      let {serviceItemId, newServiceDate, newServiceInfo, servingMasterId} = item;

      ServiceItemService.create({
        serviceItemId,
        servingMasterId,
        date: newServiceDate,
        info: newServiceInfo
      })
        .then(() => ServiceItem.find(serviceItemId, {bypassCache: true}))
        // .then(serviceItem => {
        //
        //   _.assign(serviceItem, {
        //     lastServiceDate: newServiceDate
        //   });
        //
        //   return serviceItem.DSCreate();
        //
        // })
        .then(() => {
          ServicePlanning.find(item.id, {bypassCache: true})
            .then(() => {
              delete item.newServiceDate;
              delete item.newServiceInfo;
            })
        });
    }

    function exportAllClick() {

      let groups = _.filter(vm.groupedData, {cls: 'group'});

      if (!groups.length) {
        return;
      }

      let sheets = _.map(groups, group => {
        let data = exportData(group.data);
        return {
          name: group.servingMaster.name,
          sheet: ExportExcel.worksheetFromArrayWithConfig(data, exportConfig)
        }
      });

      ExportExcel.exportWorksheetsAs(sheets, `Aptarnavimas ${vm.month}`);

    }

    function exportClick(group) {

      let {data} = group;
      let name = `${vm.month} - ${group.servingMaster.name}`;

      ExportExcel.exportArrayWithConfig(exportData(data), exportConfig, name);

    }

    function exportData(data) {

      return _.map(data, item => {

        let {serviceItem, serviceFrequency} = item;
        let {filterSystem, servicePoint, installingDate, lastServiceDate} = serviceItem;
        let {servicePrice, guaranteePeriod} = serviceItem;
        let {filterSystemType} = filterSystem;

        servicePrice = servicePrice || filterSystem.servicePrice || filterSystemType.servicePrice;

        guaranteePeriod = guaranteePeriod || filterSystem.guaranteePeriod || filterSystemType.guaranteePeriod;

        let guaranteeEnd = installingDate && moment(installingDate).add(guaranteePeriod, 'months').toDate();

        let customer = servicePoint.currentServiceContract.customer();
        let allPhones = _.clone(customer.allPhones()) || [];

        _.each(servicePoint.servicePointContacts, contact => {
          allPhones.push(...contact.person.allPhones());
        });

        let contacts = _.map(allPhones, phone => _.replace(ltphone(phone.address), /[ ]/g, '')).join(' ');

        let {apartment, doorCode} = servicePoint;
        let apartmentAndDoorCode = apartment &&
          `${apartment}${doorCode ? ' (' + doorCode + ')' : ''}`;

        let serviceItemPointInfo = _.filter([servicePoint.info, serviceItem.info]).join(' ');

        return _.defaults({

          lastServiceDate: lastServiceDate && moment(lastServiceDate).toDate(),
          installingDate,
          guaranteeEnd: {
            val: guaranteeEnd,
            style: {
              font: {strike: guaranteeEnd < vm.monthDate}
            }
          },
          apartmentAndDoorCode,
          serviceFrequency,
          servicePoint,
          serviceItem,
          filterSystem,
          customer,
          servicePrice,
          contacts,
          serviceItemPointInfo

        }, item);

      });

    }

    function servicePointClick(item) {
      Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas')(item.serviceItem.servicePoint);
    }

    function filterSystemClick(item) {
      Editing.editModal('show-service-item', `«${item.serviceItem.servicePoint.address}» irenginys`)(item.serviceItem)
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
        ServicePoint.findAllWithRelations({siteId})('Locality'),
        ServiceContract.findAll({siteId}),
        ServiceItem.findAll(),
        District.findAll(),
        ServicePlanning.findAllWithRelations({where}, {bypassCache: true})('ServiceItem')
      ];

      return vm.setBusy(busy)
        .then(() => {
          vm.rebindAll(ServicePlanning, {where}, 'vm.data', groupByServingMaster);
        });

    }

    function groupByServingMaster() {

      let groups = _.groupBy(_.filter(vm.data, 'servingMasterId'), 'servingMasterId');
      let res = [];

      let busy = [];

      _.each(groups, (data, servingMasterId) => {

        data = _.orderBy(data, ['serviceItem.servicePoint.locality.district.name', 'nextServiceDate']);

        _.each(data, item => {

          let servicePointContacts = item.serviceItem.servicePoint.DSLoadRelations('ServicePointContact')
            .then(servicePoint => {
              let {currentServiceContract} = servicePoint;
              if (!currentServiceContract) {
                return;
              }
              busy.push(currentServiceContract.customer().contactsLazy());
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