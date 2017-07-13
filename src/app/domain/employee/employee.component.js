(function (module) {

  module.component('employee', {

    templateUrl: 'app/domain/employee/employee.html',
    controller: employeeController,
    controllerAs: 'vm'

  });

  function employeeController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person} = Schema.models();

    vm.use({});

    vm.rebindAll(Employee, {}, 'vm.data');

    getData();

    function getData() {

      Employee.findAll()
        .then(data => {
          vm.employees = data;
          Person.findAll();
        });

    }

    /*
     Functions
     */


  }

})(angular.module('webPage'));