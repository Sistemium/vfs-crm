(function (module) {

  module.component('employeeTableView', {

    templateUrl: 'app/domain/employee/employeeTableView.html',
    controller: employeeTableViewController,
    controllerAs: 'vm'

  });

  function employeeTableViewController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person} = Schema.models();

    vm.use({goToList});

    vm.rebindAll(Employee, {}, 'vm.data');

    getData();


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

    function goToList() {
      $state.go('employee')
    }


  }

})(angular.module('webPage'));
