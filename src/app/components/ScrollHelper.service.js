'use strict';

(function () {

  angular.module('sistemium.services')
    .service('ScrollHelper', ScrollHelper);

  function ScrollHelper(localStorageService, saEtc) {


    function setupController(vm) {

      let {rootState} = vm;

      vm.onScope('$stateChangeStart', (event, next, nextParams, from) => {
        if (from.name === rootState) {
          saveScrollPosition(rootState);
        }
      });

      vm.restoreScrollPosition = restoreScrollPosition;

      function restoreScrollPosition(isWide) {
        scrollTo(getSavedScrollPosition(rootState), isWide);
      }

    }

    /*
     Private Functions
     */

    function localStorageKey(rootState) {
      return `${rootState}.scroll`;
    }

    function saveScrollPosition(rootState) {
      return localStorageService.set(localStorageKey(rootState), _.get(getScrollerElement(), 'scrollTop'));
    }

    function getSavedScrollPosition(rootState) {
      return localStorageService.get(localStorageKey(rootState)) || 0;
    }

    function getScrollerElement() {
      return saEtc.getElementById('scroll-main');
    }

    function scrollTo(height) {

      let elem = getScrollerElement();

      if (!elem) {
        return;
      }

      if (height > elem.scrollHeight) {
        height = elem.scrollHeight;
      }

      elem.scrollTop = height;

    }

    return {setupController};

  }

})();
