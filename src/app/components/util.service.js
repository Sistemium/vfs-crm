(function () {

  function util() {
    return {

      searchRe(search) {
        let normalized = _.replace(_.toLower(search), /[ ]+/g, ' ');
        normalized = _.replace(normalized, /["']/g, '');
        const research = _.map(_.escapeRegExp(normalized), l => {
          switch (l) {
            case ' ':
              return '.+';
            case 'z':
              return '[zž]';
            case 'c':
              return '[cč]';
            case 's':
              return '[sš]';
            case 'a':
              return '[aą]';
            case 'e':
              return '[eėę]';
            case 'i':
              return '[iį]';
            case 'u':
              return '[uųū]';
            default:
              return l;
          }
        }).join('');
        return new RegExp(research, 'i');
      },

    };
  }

  angular.module('webPage')
    .service('util', util);

})();
