'use strict';

(function () {

angular.module('core.services')
  .service('iosSockets', function ($window, toastr, $q, IOS, DEBUG, IosParser, Schema, $rootScope) {

    const SUBSCRIBE = 'subscribe';
    const CALLBACK = 'iosSocketsJsDataSubscribe';
    const DATACALLBACK = 'iosSocketsJsDataSubscribeData';

    const ons = [];
    const subscriptions = {};

    let subscribed = [];

    function subscribeDataCallback(data) {

      if (!data || !data.length) return;

      let model = Schema.model(_.get(data[0], 'entity'));

      //if (!model) return console.error('iosSockets:subscribeDataCallback:', 'no model');

      let subscriptions = _.filter(ons, {event: 'jsData:update'});

      let index = {};

      _.each(data, e => {

        if (e.data && model) {
          IosParser.parseObject(e.data, model);
        }

        index[e.xid] = e.data;

        _.each(subscriptions, subscription =>
          subscription.callback({
            resource: e.entity,
            data: e.data || {id: e.xid}
          })
        );

      });

      DEBUG('subscribeDataCallback:', data);

      // TODO: maybe should continue;
      if (!model) return;

      subscriptions = _.filter(ons, {event: 'jsData:update:finished'});

      _.each(subscriptions, subscription => {

        subscription.callback({
          model,
          data,
          index
        });

      });

    }

    function subscribeCallback(msg, data) {
      subscribed = data.entities;
      //toastr.info(angular.toJson(data),'subscribeCallback');
    }

    $window[DATACALLBACK] = data => $rootScope.$apply(() => subscribeDataCallback(data));

    $window[CALLBACK] = subscribeCallback;

    function onFn(event, callback) {

      const subscription = {
        event: event,
        callback: callback
      };

      ons.push(subscription);

      return function () {
        ons.splice(ons.indexOf(subscription), 1);
      };

    }

    function jsDataSubscribe(filter) {

      let id = uuid.v4();

      subscriptions[id] = {
        id: id,
        filter: filter
      };

      IOS.handler(SUBSCRIBE).postMessage({
        entities: filter,
        callback: CALLBACK,
        dataCallback: DATACALLBACK
      });

      return function () {

        delete subscriptions[id];

        let unsub = [];
        _.each(subscriptions, function (val) {
          Array.prototype.push.apply(unsub, val.filter);
        });

        if (_.difference(subscribed, unsub)) {
          IOS.handler(SUBSCRIBE).postMessage({
            entities: unsub,
            callback: CALLBACK,
            dataCallback: DATACALLBACK
          });
        }
      };
    }

    return {

      on: onFn,
      onJsData: onFn,
      jsDataSubscribe,

      init: x => x,
      emitQ: () => $q.reject(false)

    };

  })

  .service('Sockets', function (saSockets, $window, iosSockets) {

    if ($window.webkit) {
      return iosSockets;
    } else {
      $window.saSockets = saSockets;
      return saSockets;
    }

  });

})();
