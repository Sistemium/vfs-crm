(function (module) {

  module.component('serviceContractMaster', {

    templateUrl: 'app/domain/serviceContract/serviceContractMaster.html',
    controller: serviceContractMasterController,
    controllerAs: 'vm'

  });

  function serviceContractMasterController($scope, Schema, $state, $filter, saControllerHelper, $q) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServiceContract, Person, LegalEntity} = Schema.models();

    vm.use({

      searchText: $state.params.q,
      serviceContracts: [],

      onStateChange,
      serviceContractClick

    });

    vm.rebindAll(ServiceContract, {}, 'vm.serviceContracts', onSearch);
    vm.watchScope('vm.searchText', onSearch);

    refresh();

    /*
     Functions
     */

    function onStateChange() {

    }


    function serviceContractClick() {

    }

    function onSearch() {

      let {searchText} = vm;

      let data = filterContracts(vm.serviceContracts, searchText);

      vm.serviceContractsFiltered = $filter('orderBy')(data, '-date');

    }

    function filterContracts(data, text) {

      if (!text) return data;

      let re = new RegExp(_.escapeRegExp(text), 'i');
      let checkDateRe = /\//;
      let dateRe = new RegExp(_.escapeRegExp(text.replace(/\//g, '-')), 'i');

      return _.filter(data, contract => {

        if (re.test(contract.num)) return true;

        if (text.match(checkDateRe)) {
          if (dateRe.test(contract.date)) return true;
        }

        let customer = _.result(contract, 'customer');

        if (!customer) return;

        return re.test(customer.name);

      });

    }

    function refresh() {

      let busy = $q.all([LegalEntity.findAll(), Person.findAll()])
        .then(() => {
          return ServiceContract.findAllWithRelations()(['Person', 'LegalEntity'])
        });

      return vm.setBusy(busy);

    }

  }


})(angular.module('webPage'));