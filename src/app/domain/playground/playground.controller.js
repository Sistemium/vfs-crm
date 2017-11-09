(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('PlayGroundController', PlayGroundController);

  function PlayGroundController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Person, ServicePoint} = Schema.models();

    vm.use({
      goToDetailed
    });

    function goToDetailed(point) {
      $state.go('.detailed', {id: point.id});

    }

    Person.findAll();

    ServicePoint.findAll()
      .then(data => {
        vm.data = data;
      });

  }

})();
