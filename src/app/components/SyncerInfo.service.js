(function (module) {

  module.service('SyncerInfo', SyncerInfo);

  function SyncerInfo($window) {

    const CALLBACK = 'unsyncedInfoCallback';

    function bind(callback) {

      $window[CALLBACK] = function (obj) {
        if (_.isFunction(callback)) {
          callback(obj);
        }
      };

      let webkit = $window.webkit;

      if (webkit) {
        webkit.messageHandlers.unsyncedInfoService.postMessage({
          unsyncedInfoCallback: CALLBACK
        });
        return true;
      }

    }

    const syncerState = {};

    function stateInfoCallback(state) {
      _.assign(syncerState, {
        hasUnsynced: _.first(state) === 'haveUnsyncedObjects'
      });
    }

    function watch(scope, callback) {
      let unwatch = scope.$watch(() => syncerState, callback, true);
      scope.$on('$destroy', unwatch);
    }

    bind(stateInfoCallback);

    return {
      watch
    };

  }

})(angular.module('core.services'));
