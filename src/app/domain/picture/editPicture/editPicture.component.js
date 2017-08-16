(function (module) {

  module.component('editPicture', {

    bindings: {
      picture: '='
    },

    templateUrl: 'app/domain/picture/editPicture/editPicture.html',
    controller: editPictureController,
    controllerAs: 'vm'

  });

  function editPictureController() {

  }

})(angular.module('webPage'));
