
(function(){


  function cleanName() {

    return input => {

      return !input || input.replace(/^\.+/,'');

    };

  }

  angular.module('core.services')
    .filter('cleanName', cleanName);

})();
