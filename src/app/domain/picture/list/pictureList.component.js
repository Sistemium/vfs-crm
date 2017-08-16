(function (module) {

  module.component('brandList', {

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
