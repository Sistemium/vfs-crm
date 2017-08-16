(function (module) {

  module.component('pictureMaster', {

    templateUrl: 'app/domain/picture/pictureMaster.html',
    controller: pictureMasterController,
    controllerAs: 'vm'

  });

  function pictureMasterController($scope, Schema, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Picture} = Schema.models();

    vm.use({
      $onInit,
      addClick
    });

    /*
     Functions
     */

    function addClick() {
      Editing.editModal('edit-picture', 'Nauja Nuotrauka')(Picture.createInstance());
    }

    function $onInit() {
      refresh();
    }

    function refresh() {

      let busy = [
        Picture.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }
  }

})(angular.module('webPage'));