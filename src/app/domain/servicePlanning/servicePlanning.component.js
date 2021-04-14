(function () {

  angular.module('webPage')
    .component('servicePlanning', {

      bindings: {
        month: '=',
        servingMasterId: '=',
      },

      templateUrl: 'app/domain/servicePlanning/servicePlanning.html',
      controller: servicePlanningController,
      controllerAs: 'vm'

    });

  function servicePlanningController($scope, saControllerHelper, Schema, moment, Editing,
                                     servicePlanningExportConfig, ExportExcel, $q, saEtc,
                                     ServicePlanningService, $uibModal, util) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        oldDates: false,
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
      Site, District, ServiceItemService,
      Locality,
    } = Schema.models('');

    const exportConfig = servicePlanningExportConfig.ServicePlanning;

    vm.watchScope('vm.monthDate', () => {
      vm.month = moment(vm.monthDate).format('YYYY-MM');
    });

    vm.watchScope('vm.month', onMonthChange);
    vm.watchScope(() => _.get(Site.meta.getCurrent(), 'id'), onMonthChange);
    vm.watchScope('vm.searchText', saEtc.debounce(onSearch, 400));
    vm.watchScope('vm.servingMasterId', onMonthChange);

    $scope.$on('ServicePlanningUpdated', (e, planning, service, serviceItem) => {
      const servicePlanning = _.find(vm.groupedData, { id: planning.id });
      if (servicePlanning) {
        servicePlanning.service = service;
        servicePlanning.serviceItem = serviceItem;
        servicePlanning.serviceStatus = servicePlanning.serviceStatusCode();
      }
    });

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

      const re = util.searchRe(searchText);

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
      const title = 'Aptarnavimo Taško Redagavimas';
      Editing.editModal('edit-service-point', title)(serviceItem.servicePoint);
    }

    function filterSystemClick({ serviceItem }) {

      const etc = { monthDate: vm.monthDate };
      const siteId = Site.meta.getCurrent().id;
      const filter = dateFilter({ siteId, id: serviceItem.id });

      const { ts } = serviceItem;
      const title = `«${serviceItem.servicePoint.address}» irenginys`;

      Editing.editModal('show-service-item', title)(serviceItem, etc)
        .catch(_.noop)
        .finally(() => ServiceItem.find(serviceItem.id, { bypassCache: true })
          .then(({ ts: updatedTs }) => {
            if (updatedTs !== ts) {
              return ServicePlanning.findAll(filter, { bypassCache: true })
                .then(([item]) => {
                  if (!item) {
                    // TODO: process item delete
                    return;
                  }
                  item.serviceStatus = item.serviceStatusCode();
                });
            }
          }));
    }

    function onMonthChange() {
      vm.siteId = _.get(Site.meta.getCurrent(), 'id');
      if (vm.month && Site.meta.getCurrent()) {
        vm.groupedDataFiltered = [];
        refresh();
      }
    }

    function refresh() {

      const siteId = Site.meta.getCurrent().id;
      const { servingMasterId } = vm;

      if (!servingMasterId) {
        return;
      }

      const where = dateFilter({ siteId, servingMasterId });

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
        ServicePoint.findAll({ siteId })
          .then(servicePoints => {
            const toLoad = _.filter(servicePoints, ({ locality, localityId }) => localityId && !locality);
            const ids = _.filter(_.map(toLoad, 'localityId'));
            return Locality.findByMany(ids);
          }),
        ServiceContract.findAll({ siteId }),
        // ServiceItem.findAll(),
        District.findAll(),
        ServiceItemService.findAll(serviceFilter, { bypassCache: true }),
        ServicePlanning.findAll(where, { bypassCache: true })
          .then(res => {
            const toLoad = _.filter(res, ({ serviceItem }) => !serviceItem);
            const ids = _.filter(_.map(toLoad, 'serviceItemId'));
            return ServiceItem.findByMany(ids)
              .then(() => {
                vm.data = res;
              });
          })
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
          //
          // vm.rebindAll(ServicePlanning, {}, 'vm.servicePlanningAll', () => {
          //
          // });

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
