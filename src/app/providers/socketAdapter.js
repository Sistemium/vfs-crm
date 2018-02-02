'use strict';

(function () {

  angular.module('Models').service('SocketAdapter', function (Sockets) {

    const DEBUG = debug('stg:SocketAdapter');
    const Defaults = function () {
    };

    const defaultsPrototype = Defaults.prototype;

    defaultsPrototype.basePath = '';

    function SocketAdapter(options) {

      this.defaults = new Defaults();
      _.assign(this.defaults, options || {});

    }

    function emit(options) {

      let q = Sockets.emitQ('jsData', options);

      q.then(function (data) {
        DEBUG('emit:success', options.resource, data, options);
      }, function (err) {
        DEBUG('emit:catch', err, options);
      });

      return q;

    }

    function paramsToOptions(params, options) {

      options = options || {};

      let parsed = _.assign({}, params);

      if (params.orderBy) {
        parsed['x-order-by:'] = _.map(params.orderBy, order => {
          let [col, dir] = order;
          return `${dir.match(/desc/i) ? '-' : ''}${col}`;
        }).join(',');
      }

      if (params.limit) {
        parsed['x-page-size:'] = params.limit;
      }

      if (params.offset) {
        parsed['x-start-page:'] = Math.ceil(params.offset / (params.limit || 1)) + 1;
      }

      let where = params.where;

      if (where) {

        _.each(where, (val, key) => {
          if (val.likei) {
            parsed['searchFields:'] = key;
            parsed['searchFor:'] = val.likei;
          }
        });

        parsed['where:'] = angular.toJson(where);

      }

      if (_.isArray(options.groupBy)) {
        parsed['groupBy:'] = options.groupBy.join(',');
      }

      delete parsed.where;
      delete parsed.offset;
      delete parsed.limit;
      delete parsed.orderBy;

      return parsed;
    }

    SocketAdapter.prototype.findAll = function (resource, params, options) {
      return emit({
        method: 'findAll',
        //TODO rename models with pool or set basePath for adapter or leave as it is now
        resource: (this.defaults.pool || options.pool) + '/' + resource.name,
        params: paramsToOptions(params, options),
        options: angular.extend({
          headers: {
            'x-page-size': options.limit || 5000,
            'x-start-page': options.startPage || 1
          }
        }, options)
      });
    };

    SocketAdapter.prototype.find = function (resource, id, options) {
      return emit({
        method: 'find',
        //TODO rename models with pool or set basePath for adapter or leave as it is now
        resource: (this.defaults.pool || options.pool) + '/' + resource.name,
        id: id,
        options: options
      });
    };

    SocketAdapter.prototype.create = function (resource, attrs, options) {
      return emit({
        method: 'create',
        resource: (this.defaults.pool || options.pool) + '/' + resource.name,
        attrs: angular.extend(attrs || {}, {deviceCts: moment().utc().format('YYYY-MM-DD HH:mm:ss.SSS')})
      });
    };

    SocketAdapter.prototype.update = function (resource, id, attrs, options) {
      let deviceCts = _.get(attrs, 'deviceCts');
      if (!deviceCts) {
        attrs = angular.extend(attrs || {}, {deviceCts: moment().utc().format('YYYY-MM-DD HH:mm:ss.SSS')});
      }
      return emit({
        method: 'update',
        resource: (this.defaults.pool || options.pool) + '/' + resource.name,
        id: id,
        attrs: attrs
      });
    };

    SocketAdapter.prototype.destroy = function (resource, id, options) {
      let q = emit({
        method: 'destroy',
        resource: (this.defaults.pool || options.pool) + '/' + resource.name,
        id: id,
        options: options
      });

      q.catch(function (err) {
        if (err && err.error === 404) {
          resource.eject(id);
        }
      });

      return q;
    };

    return SocketAdapter;
  });

})();
