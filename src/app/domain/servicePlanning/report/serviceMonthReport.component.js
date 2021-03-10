(function () {

  angular.module('webPage')
    .component('serviceMonthReport', {

      bindings: {
        dateB: '<',
        dateE: '<',
        servingMasterId: '<',
        groupBy: '@',
      },

      templateUrl: 'app/domain/servicePlanning/report/serviceMonthReport.html',
      controller: serviceMonthReportController,
      controllerAs: 'vm'

    });

  function serviceMonthReportController($scope, saControllerHelper, Schema) {

    const { ServiceItemService, ServiceItem } = Schema.models();

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      groupings: [
        { code: 'serviceItem.filterSystem.filterSystemType.name', name: 'Sistemos Tipas' },
        { code: 'serviceItem.filterSystem.name', name: 'Sistema' },
      ],
      setGrouping,
      grouping: null,
    });


    function $onInit() {

      const { servingMasterId, dateB, dateE } = vm;

      setGrouping(vm.groupings[0]);

      const busy = ServiceItemService.findAll({ servingMasterId, dateB, dateE }, { bypassCache: true })
        .then(data => {

          const loadIds = _.filter(data, s => !s.serviceItem);

          if (!loadIds.length) return data;

          return ServiceItem.findAll({
            where: { id: { in: _.map(loadIds, 'serviceItemId') } },
          })
            .then(() => data);

        })
        .then(reportData);

      vm.setBusy(busy);

    }

    function setGrouping(grouping) {
      vm.grouping = grouping;
      reportData();
    }

    function reportData(data = vm.rawData) {

      const { grouping: { code: groupBy } } = vm;

      const grouped = _.groupBy(data, item => _.get(item, groupBy) || 'Nenurodytas');

      vm.data = _.map(grouped, (items, id) => {
        return {
          id,
          items,
          types: _.groupBy(items, 'type'),
          // filterSystem: FilterSystem.get(filterSystemId),
        };
      });

      vm.totals = {
        items: _.sumBy(vm.data, 'items.length'),
        service: _.sumBy(vm.data, 'types.service.length'),
        pause: _.sumBy(vm.data, 'types.pause.length'),
        forward: _.sumBy(vm.data, 'types.forward.length'),
      };

      vm.rawData = data;

    }

  }

})();