(function () {

  angular.module('webPage')
    .component('serviceMonthReport', {

      bindings: {
        dateB: '<',
        dateE: '<',
        servingMasterId: '<',
      },

      templateUrl: 'app/domain/servicePlanning/report/serviceMonthReport.html',
      controller: serviceMonthReportController,
      controllerAs: 'vm'

    });

  function serviceMonthReportController($scope, saControllerHelper, Schema) {

    const { ServiceItemService, ServiceItem, FilterSystem } = Schema.models();

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit
    });


    function $onInit() {

      const { servingMasterId, dateB, dateE } = vm;

      ServiceItemService.findAll({ servingMasterId, dateB, dateE }, { bypassCache: true })
        .then(data => {

          const loadIds = _.filter(data, s => !s.serviceItem);

          if (!loadIds.length) return data;

          return ServiceItem.findAll({
            where: { id: { in: _.map(loadIds, 'serviceItemId') } },
          });

        })
        .then(reportData);

    }

    function reportData(data) {

      const grouped = _.groupBy(data, 'serviceItem.filterSystemId');

      vm.data = _.map(grouped, (items, filterSystemId) => {
        return {
          id: filterSystemId,
          items,
          types: _.groupBy(items, 'type'),
          filterSystem: FilterSystem.get(filterSystemId),
        };
      });

      vm.totals = {
        items: _.sumBy(vm.data, 'items.length'),
        service: _.sumBy(vm.data, 'types.service.length'),
        pause: _.sumBy(vm.data, 'types.pause.length'),
        forward: _.sumBy(vm.data, 'types.forward.length'),
      }

    }

  }

})();