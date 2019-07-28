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
                                     servicePlanningExportConfig, ExportExcel, $q, saEtc,
                                     ServicePlanningService, $uibModal) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        monthDate: new Date(this.month),
        filterSystemClick,
        servicePointClick,
        exportClick,
        exportAllClick,
        reportClick,
        personNameClick,
      });

    const {
      ServicePlanning, Employee, Person, FilterSystem, Brand, ServicePoint,
      ServiceItem, ServiceContract, LegalEntity,
      Site, District, ServiceItemService
    } = Schema.models('');

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

    function dateFilter(filter) {
      return ServicePlanningService.dateFilter(filter, vm.monthDate);
    }

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

        if (res) {
          return res;
        }

        res = _.find(item.contacts, ({ person }) => re.test(person.name));

        return res;

      }

    }

    function exportAllClick() {

      let groups = _.filter(vm.groupedData, { cls: 'group' });

      if (!groups.length) {
        return;
      }

      let sheets = _.map(groups, group => {
        let data = ServicePlanningService.exportData(group.data, vm.monthDate);
        return {
          name: group.servingMaster.name,
          sheet: ExportExcel.worksheetFromArrayWithConfig(data, exportConfig)
        }
      });

      ExportExcel.exportWorksheetsAs(sheets, `Aptarnavimas ${vm.month}`);

    }

    function exportClick(group) {

      const { data } = group;
      const name = `${vm.month} - ${group.servingMaster.name}`;
      const exportData = ServicePlanningService.exportData(data, vm.monthDate);

      ExportExcel.exportArrayWithConfig(exportData, exportConfig, name);

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
                item.serviceStatus = item.serviceStatusCode();
              });
          }
        })
        .catch(_.noop);
    }

    function onMonthChange() {
      // console.info(vm.month);
      if (vm.month && Site.meta.getCurrent()) {
        vm.groupedDataFiltered = [];
        refresh();
      }
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
          vm.rebindAll(ServiceItemService, serviceFilter, 'vm.services', () => {
            const busy = ServicePlanningService.groupByServingMaster(vm.data, serviceFilter);
            vm.setBusy(busy);
            busy.then(res => {
              vm.groupedData = res;
              onSearch();
            });
          });
        });

    }

    function personNameClick(item) {

      let component = `edit-${_.kebabCase(item.constructor.name)}`;
      let model = Schema.model(item.constructor.name);
      let title = `${model.meta.label.genitive} Redagavimas`;

      Editing.editModal(component, title)(item);

    }


    function reportClick(item) {

      const modal = $uibModal.open({

        animation: true,
        templateUrl: 'app/domain/servicePlanning/report/serviceReportModal.html',
        size: 'lg',

        controller() {
          _.assign(this, dateFilter({
            title: item.servingMaster.name,
            lead: `Aptarnavimo ataskaita už ${vm.month}`,
            servingMasterId: item.servingMaster.id,
            cancelClick: () => modal.dismiss(),
          }));
        },

        controllerAs: 'vm',
        bindToController: true,

      });

      modal.result
        .catch(() => {
        });

    }

  }


})();
