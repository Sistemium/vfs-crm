(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('PlayGroundController', PlayGroundController);

  function PlayGroundController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person, ServicePoint} = Schema.models();

    vm.use({
      goToDetailed
    });


    function goToDetailed(point) {
      $state.go('.detailed', {id: point.id});

      ServicePoint.find(point.id).then((a, b) => {
        console.error(a, b);
      });

    }

    Person.findAll();

    ServicePoint.findAll()
      .then(data => {
        console.log('ServicePoint fired');
        vm.data = data;
      });

    Employee.find('dc2a0b00-5bef-11e7-8000-6c40089c5fc0')
      .then(data => console.log(data));

  }

})();
