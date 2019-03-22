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
                                     servicePlanningExportConfig, ExportExcel, $filter, $q, saEtc) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        monthDate: new Date(this.month),
        filterSystemClick,
        servicePointClick,
        exportClick,
        exportAllClick,
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
    vm.watchScope('vm.searchText', saEtc.debounce(onSearch, 400));
    vm.watchScope('vm.servingMasterId', onSearch);

    /*
    Functions
     */

    function onSearch() {

      const { searchText, servingMasterId } = vm;

      if (!searchText && !servingMasterId) {
        vm.groupedDataFiltered = vm.groupedData;
        return;
      }

      const re = new RegExp(_.escapeRegExp(searchText), 'i');

      vm.groupedDataFiltered = _.filter(vm.groupedData, filterService);

      function filterService(item) {

        const servicePoint = _.get(item, 'serviceItem.servicePoint');
        const masterId = item.servingMasterId || item.id;

        if (servingMasterId && masterId !== servingMasterId) {
          return false;
        }

        if (!servicePoint) {
          return servingMasterId && masterId === servingMasterId;
        }

        let res;

        res = re.test(servicePoint.address);

        if (res) {
          return res;
        }

        res = re.test(servicePoint.currentServiceContract.customer().name);

        return res;

      }

    }

    function exportAllClick() {

      let groups = _.filter(vm.groupedData, { cls: 'group' });

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

      let { data } = group;
      let name = `${vm.month} - ${group.servingMaster.name}`;

      ExportExcel.exportArrayWithConfig(exportData(data), exportConfig, name);

    }

    function exportData(data) {

      return _.map(data, item => {

        let { serviceItem, serviceFrequency } = item;
        let { filterSystem, servicePoint, installingDate, lastServiceDate } = serviceItem;
        let { servicePrice, guaranteePeriod } = serviceItem;
        let { filterSystemType } = filterSystem;

        servicePrice = servicePrice || filterSystem.servicePrice || filterSystemType.servicePrice;

        guaranteePeriod = guaranteePeriod || filterSystem.guaranteePeriod || filterSystemType.guaranteePeriod;

        let guaranteeEnd = installingDate && moment(installingDate).add(guaranteePeriod, 'months').toDate();

        let customer = servicePoint.currentServiceContract.customer();
        let allPhones = _.clone(customer.allPhones()) || [];

        _.each(servicePoint.servicePointContacts, contact => {
          allPhones.push(...contact.person.allPhones());
        });

        let contacts = _.map(allPhones, phone => _.replace(ltphone(phone.address), /[ ]/g, '')).join(' ');

        let { apartment, doorCode } = servicePoint;
        let apartmentAndDoorCode = apartment &&
          `${apartment}${doorCode ? ' (' + doorCode + ')' : ''}`;

        let serviceItemPointInfo = _.filter([serviceItem.serviceInfo, serviceItem.additionalServiceInfo]).join('\n');

        return _.defaults({

          lastServiceDate: lastServiceDate && moment(lastServiceDate).toDate(),
          installingDate,
          guaranteeEnd: {
            val: guaranteeEnd,
            style: {
              font: { strike: guaranteeEnd < vm.monthDate }
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

    function servicePointClick({ serviceItem }) {
      Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas')(serviceItem.servicePoint);
    }

    function filterSystemClick({ serviceItem }) {
      const etc = { monthDate: vm.monthDate };
      const filter = dateFilter({ id: serviceItem.id });
      Editing.editModal('show-service-item', `«${serviceItem.servicePoint.address}» irenginys`)(serviceItem, etc)
        .then(() => {
          if (serviceItem.id) {
            return ServicePlanning.findAll(filter, { bypassCache: true })
              .then(([item]) => {
                item.serviceStatus = serviceStatus(item);
              });
          }
        })
        .catch(_.noop);
    }

    function onMonthChange() {
      console.info(vm.month);
      if (vm.month && Site.meta.getCurrent()) {
        refresh();
      }
    }

    function dateFilter(filter) {

      const date = moment(vm.monthDate);

      if (!date.isValid()) {
        return;
      }

      const dateB = date.format();

      const monthEnd = date.add(1, 'month').add(-1, 'day');

      const dateE = monthEnd.format();

      return _.assign({ dateB, dateE }, filter);

    }

    function refresh() {

      const siteId = Site.meta.getCurrent().id;
      const where = dateFilter({ siteId });

      if (!where) {
        return;
      }

      const serviceFilter = {
        where: { date: { '>=': where.dateB, '<=': where.dateE } },
      };

      const busy = [
        Person.findAll(),
        LegalEntity.findAll(),
        FilterSystem.findAll(),
        Brand.findAll(),
        Employee.findAll(),
        ServicePoint.findAllWithRelations({ siteId })('Locality'),
        ServiceContract.findAll({ siteId }),
        ServiceItem.findAll(),
        District.findAll(),
        ServiceItemService.findAll(serviceFilter, { bypassCache: true }),
        ServicePlanning.findAllWithRelations(where, { bypassCache: true })('ServiceItem')
          .then(res => (vm.data = res))
      ];

      return vm.setBusy(busy)
        .then(() => {
          vm.rebindAll(ServiceItemService, serviceFilter, 'vm.services', () => groupByServingMaster(serviceFilter));
        });

    }

    function serviceStatus(item) {
      if (!item.service && item.serviceItem.pausedFrom) {
        return 'paused';
      } else if (item.service) {
        return 'served';
      }

      return 'serving';
    }

    function groupByServingMaster(serviceFilter) {

      let groups = _.groupBy(_.filter(vm.data, 'servingMasterId'), 'servingMasterId');
      let res = [];

      let busy = [];

      let services = ServiceItemService.filter(serviceFilter);

      let servicesByItem = _.keyBy(services, 'serviceItemId');

      _.each(groups, (data, servingMasterId) => {

        data = _.orderBy(data, ['serviceItem.servicePoint.locality.district.name', 'nextServiceDate']);

        _.each(data, item => {

          const { serviceItem } = item;
          item.service = servicesByItem[item.id];

          item.serviceStatus = serviceStatus(item);

          let servicePointContacts = serviceItem.servicePoint.DSLoadRelations('ServicePointContact')
            .then(servicePoint => {
              let { currentServiceContract } = servicePoint;
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
      onSearch();

    }

  }


})();
