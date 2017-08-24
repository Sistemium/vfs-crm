(function (module) {

  module.component('pictureList', {

    bindings: {
      brands: '='
    },

    templateUrl: 'app/domain/picture/list/pictureList.html',
    controller: pictureListController,
    controllerAs: 'vm'

  });

  function pictureListController() {


  }

})(angular.module('webPage'));
