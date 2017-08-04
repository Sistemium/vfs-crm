(function (module) {

  module.component('employeeMaster', {

    templateUrl: 'app/domain/employee/employeeMaster.html',
    controller: employeeMasterController,
    controllerAs: 'vm'

  });

  function employeeMasterController($scope, Schema, saControllerHelper, $filter, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person, Picture} = Schema.models();

    vm.use({
      addClick
    });

    vm.rebindAll(Employee, {}, 'vm.data', onSearch);

    vm.watchScope('vm.searchText', onSearch);

    getData();

    /*
     Functions
     */

    function addClick() {
      Editing.editModal('edit-employee', 'Naujas Darbuotojas')(Employee.createInstance())
    }

    function onSearch() {

      let {searchText} = vm;

      vm.employees = searchText ? $filter('filter')(vm.data, searchText) : vm.data;

    }

    function getData() {

      let busy = Person.findAll()
        .then(() => Picture.findAll())
        .then(() => Employee.findAll());

      vm.setBusy(busy);

    }

  }

})(angular.module('webPage'));
