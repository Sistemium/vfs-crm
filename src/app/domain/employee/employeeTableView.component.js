(function (module) {

  module.component('employeeTableView', {

    templateUrl: 'app/domain/employee/employeeTableView.html',
    controller: employeeTableViewController,
    controllerAs: 'vm'

  });

  function employeeTableViewController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person} = Schema.models();

    vm.use({});

    vm.rebindAll(Employee, {}, 'vm.data');

    getData();

    console.log(vm.searchText);

    /*
     Functions
     */

    function getData() {

      Employee.findAll()
      .then(data => {
        vm.employees = data;
        Person.findAll();
      });
    }

  }

})(angular.module('webPage'));
