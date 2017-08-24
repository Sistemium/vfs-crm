(function (module) {

  module.component('pictureList', {

    bindings: {
      pictures: '='
    },

    templateUrl: 'app/domain/picture/list/pictureList.html',
    controller: pictureListController,
    controllerAs: 'vm'

  });

  function pictureListController() {


  }

})(angular.module('webPage'));
