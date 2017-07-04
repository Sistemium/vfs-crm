'use strict';

(function () {

  angular.module('core.services').service('SoundSynth', function ($window, toastr, $q, IOS) {

    var rate = 0.4;
    var pitch = 1;
    var lastSpeech = false;
    var speakerCallBackFn = 'speakerCallBack';
    var promises = {};
    var id = 1;

    function speakerCallBack() {
      _.each(promises, function (promise, id) {
        promise.resolve();
        delete promises[id];
      });
    }

    $window[speakerCallBackFn] = speakerCallBack;

    IOS.getDevicePlatform()
      .then(devicePlatform => {
        if (/iPhone/.test(devicePlatform)) {
          // rate = 0.2;
        }
      })
      .catch(()=>{
        // We're not under ios
      });

    function speaker(text) {
      return $q(function (resolve) {

        promises [id] = {
          resolve: resolve
        };

        $window.webkit.messageHandlers.sound.postMessage({
          text: text.replace(/[^а-я0-9,]/ig, ' '),
          rate: rate,
          pitch: pitch,
          callBack: speakerCallBackFn,
          options: {
            requestId: id++
          }
        });

      });
    }

    function mockSpeaker(text) {
      return $q(function (resolve) {
        toastr.success(text);
        resolve();
      });
    }

    function say(text) {
      var sp = $window.webkit ? speaker : mockSpeaker;
      lastSpeech = text;
      return sp(text);
    }

    return {
      say,
      repeat: () => say(lastSpeech)
    };

  });

})();
