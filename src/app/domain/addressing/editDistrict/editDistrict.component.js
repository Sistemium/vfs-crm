(function (module) {

  module.component('editDistrict', {

    bindings: {
      district: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/addressing/editDistrict/editDistrict.html',
    controller: editDistrictController,
    controllerAs: 'vm'

  });

  function editDistrictController($scope, UUID, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      id: `edit-district-${UUID.v4()}`
    });

    $scope.$watch(() => vm.district.isValid(), (nv) => {

      if (!!nv) {
        vm.readyState[vm.id] = true;
      }

    });

    $scope.$on('$destroy', () => {
      delete vm.readyState[vm.id]
    });

  }

})(angular.module('webPage'));
