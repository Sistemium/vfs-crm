'use strict';

(function () {

  function mapsHelper ($window,mapApiLoad) {

    var doc = $window.document;

    var me = {
      google: $window.google,
      yandex: $window.ymaps
    };

    mapApiLoad(function(){
      me.yandex = $window.ymaps;
      // console.log ('yandex', me.yandex);
    });

    function distanceFn (a,b) {
      return me.yandex.coordSystem.geo.distance(a,b);
    }

    function yPixelDistance(a,b) {
      return Math.sqrt(Math.pow(a[0] - b[0],2) + Math.pow(a[1] - b[1],2));
    }

    function yLatLng (location) {
      return [location.longitude,location.latitude];
    }

    function yMarkerConfig (options) {
      return {
        id: options.id,
        geometry: {
          type: 'Point',
          coordinates: yLatLng(options.location)
        },
        properties: {
          iconContent: options.content,
          hintContent: options.hintContent
        }
      };
    }

    function bounds (locations) {

      var
        minLatitude = _.min(locations,'latitude'),
        maxLatitude = _.max(locations,'latitude'),
        minLongitude = _.min(locations,'longitude'),
        maxLongitude = _.max(locations,'longitude')
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

    function yPixelCoords (map) {
      var zoom = map.getZoom();
      var projection = map.options.get('projection');
      return function (location) {
        return map.converter.globalToPage(
          projection.toGlobalPixels(yLatLng(location), zoom)
        );
      };
    }

    function loadGoogleScript (callback) {
      var key = 'AIzaSyCPS3yD729qC1yNUpON0cWpc2gGXSOeeTQ';
      var script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?' +
        'v=3&callback=' + callback +
        '&libraries=geometry' +
        '&key=' + key +
        '&language=ru&region=ru';
      doc.body.appendChild(script);
    }

    return angular.extend (me,{
      loadGoogleScript: loadGoogleScript,
      yLatLng: yLatLng,
      yMarkerConfig: yMarkerConfig,
      yPixelDistance: yPixelDistance,
      distanceFn: distanceFn,
      bounds: bounds,
      yPixelCoords: yPixelCoords,
      checkinIcon: function (options){
        return angular.extend ({
          //path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
          path: 'M22-48h-44v43h16l6 5 6-5h16z',
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          strokeColor: '#0000',
          strokeWeight: 1,
          scale: 0.6
        },options);
      }
    });

  }

  angular.module('core.services')
    .service('mapsHelper', mapsHelper);

})();
