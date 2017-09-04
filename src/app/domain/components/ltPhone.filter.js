(function () {

  angular.module('core.services')
    .filter('ltphone', ltPhoneFilter);


  function ltPhoneFilter() {

    return function (input) {

      if (!input) return '';

      let parts = input.match(/(\d{3})(\d{2})(\d{3})/);

      return `+370 (${parts[1]}) ${parts[2]}-${parts[3]}`;

    };

  }

})();