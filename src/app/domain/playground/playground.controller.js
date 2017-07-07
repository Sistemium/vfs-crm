(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('PlayGroundController', PlayGroundController);

  function PlayGroundController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person, ServicePoint} = Schema.models();

    vm.use({});

    Person.findAll();

    ServicePoint.findAll()
      .then(data => {
        vm.data = data;
        _.each(data, (a, b) => {
          console.log(a, b);
        });
      });

    Employee.find('dc2a0b00-5bef-11e7-8000-6c40089c5fc0')
      .then(data => console.log(data));

  }
})();
