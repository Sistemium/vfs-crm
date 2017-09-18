'use strict';

(function () {

  function mapsHelper($window, $q) {

    var doc = $window.document;

    var me = {
      google: $window.google
    };

    function bounds(locations) {

      var
        minLatitude = _.min(locations, 'latitude'),
        maxLatitude = _.max(locations, 'latitude'),
        minLongitude = _.min(locations, 'longitude'),
        maxLongitude = _.max(locations, 'longitude')
      ;

      var res = {
        southwest: {
          latitude: minLatitude.latitude,
          longitude: minLongitude.longitude
        },
        northeast: {
          latitude: maxLatitude.latitude,
          longitude: maxLongitude.longitude
        }
      };

      res.center = {
        latitude: (res.southwest.latitude + res.northeast.latitude) / 2.0,
        longitude: (res.southwest.longitude + res.northeast.longitude) / 2.0
      };

      return res;

    }

    function loadGoogleScript() {

      return $q(resolve => {

        if (me.google) {
          return resolve();
        }

        let key = 'AIzaSyCPS3yD729qC1yNUpON0cWpc2gGXSOeeTQ';
        let script = doc.createElement('script');

        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?' +
          'v=3&callback=onNgMapReady' +
          '&libraries=geometry,places' +
          '&key=' + key +
          '&language=lt&region=lt';
        doc.body.appendChild(script);

        function onNgMapReady() {
          me.google = $window.google;
          resolve();
        }

        $window.onNgMapReady = onNgMapReady;

      })

    }

    return angular.extend(me, {
      loadGoogleScript: loadGoogleScript,
      bounds: bounds
    });

  }

  angular.module('core.services')
    .service('mapsHelper', mapsHelper);

})();
