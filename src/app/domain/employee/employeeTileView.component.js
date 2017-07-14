(function (module) {

  module.component('employeeTileView', {

    templateUrl: 'app/domain/employee/employeeTileView.html',
    controller: employeeTileViewController,
    controllerAs: 'vm'

  });

  function employeeTileViewController($scope, Schema, saControllerHelper, $state) {

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
