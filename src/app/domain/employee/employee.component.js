(function (module) {

  module.component('employee', {

    templateUrl: 'app/domain/employee/employee.html',
    controller: employeeController,
    controllerAs: 'vm'

  });

  function employeeController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person} = Schema.models();

    vm.use({
      goToTile,
      goToTable,
      $onInit
    });

    vm.rebindAll(Employee, {}, 'vm.data');

    getData();

    /*
     Functions
     */

    function $onInit() {
      if ($state.current.name === 'employee') {
        goToTable();
      }
    }

    function goToTile() {
      $state.go('.detailedTiles');
    }

    function goToTable() {
      $state.go('.detailedTable')
    }

    function getData() {

      Employee.findAll()
        .then(data => {
          vm.employees = data;
          Person.findAll();
        });

    }

  }

})(angular.module('webPage'));
