angular.module('core.services')
  .filter('stnumber', function($filter) {
    return function stnumberFilter (input, minDecimals) {

      minDecimals = minDecimals || 0;

      var out = $filter('number') (input);

      if (out && minDecimals) {
        var decimals = out.match(/.*(\.{1})([0-9]+)/) || [0, '', ''];

        if (!decimals[1]) {
          out += '.';
        }

        if (decimals[2].length < minDecimals) {
          out += _.repeat('0',minDecimals - decimals[2].length);
        }
      }

      return out;

    };
  });
