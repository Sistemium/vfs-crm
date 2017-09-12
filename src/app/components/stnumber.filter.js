(function () {

  angular.module('core.services')
    .filter('stnumber', function ($filter) {

      return function (input, minDecimals) {

        minDecimals = minDecimals || 0;

        let out = $filter('number')(input);

        if (out && minDecimals) {

          const decimals = out.match(/.*(\.{1})([0-9]+)/) || [0, '', ''];

          if (!decimals[1]) {
            out += '.';
          }

          if (decimals[2].length < minDecimals) {
            out += _.repeat('0', minDecimals - decimals[2].length);
          }

        }

        return out;

      };
    });

})();