'use strict';

(function () {

  angular.module('webPage')
  .service('servicePointEditing', servicePointEditing);

  function servicePointEditing($uibModal) {

    return {openEditItemModal};

    function openEditItemModal(point) {

      $uibModal.open({

        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'app/domain/components/navigationBar/newServicePoint.html',
        size: 'lg',

        controller: function () {
          let vm = this;
          vm.point = point;
        },
        controllerAs: 'vm'

      });

    }

  }

})();