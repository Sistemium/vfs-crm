(function (module) {

  module.component('employee', {

    templateUrl: 'app/domain/employee/employee.html',
    controller: employeeController,
    controllerAs: 'vm'

  });

  function employeeController($scope, Schema, saControllerHelper, $filter) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person} = Schema.models();

    vm.use({});

    vm.rebindAll(Employee, {}, 'vm.data', onSearch);

    vm.watchScope('vm.searchText', onSearch);

    getData();

    /*
     Functions
     */

    function onSearch() {

      let {searchText} = vm;

      vm.employees = searchText ? $filter('filter')(vm.data, searchText) : vm.data;

    }

    function getData() {

      let busy = Person.findAll()
        .then(() => Employee.findAll());

      vm.setBusy(busy);

    }

  }

})(angular.module('webPage'));
