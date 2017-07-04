(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('PlayGroundController', PlayGroundController);

  function PlayGroundController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Person} = Schema.models();

    vm.use({
      version: 0.1
    });

    Person.findAll()
      .then(data => vm.data = data);

  }
})();
