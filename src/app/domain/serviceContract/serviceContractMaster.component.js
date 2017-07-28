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

      let data = searchText ? filterContracts(vm.serviceContracts, searchText) : vm.serviceContracts;

      vm.serviceContractsFiltered = $filter('orderBy')(data, '-date');

    }

    function filterContracts(data, text) {

      let re = new RegExp(_.escapeRegExp(text), 'i');

      return _.filter(data, contract => {

        let res = re.test(contract.num);

        if (res) return;

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