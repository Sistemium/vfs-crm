(function (module) {

  module.component('employeeTileView', {

    templateUrl: 'app/domain/employee/employeeTileView.html',
    controller: employeeTileViewController,
    controllerAs: 'vm'

  });

  function employeeTileViewController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person} = Schema.models();

    vm.use({});

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

  }

})(angular.module('webPage'));
