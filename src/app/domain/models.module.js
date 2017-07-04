'use strict';

(function () {

  let basePath = window.localStorage.getItem('JSData.BasePath')
      || location.protocol === 'https:' && '/api/dev/'
      || 'https://api.sistemium.com/v4d/dev/'
    ;

  angular.module('Models', ['sistemium', 'LocalStorageModule'])
    .config(ModelsConfig)
    .service('Schema', Schema)
    .service('models', Models)
    .run(registerAdapters);

  function ModelsConfig(DSHttpAdapterProvider) {
    angular.extend(DSHttpAdapterProvider.defaults, {
      basePath: basePath
    });
  }

  function Models(Schema) {
    return Schema.models();
  }

  function Schema(saSchema, $http, $window, DEBUG, $q, DS, DSUtils) {

    function loadPaged(resource, filter, opts) {

      let options = _.defaults({
        startPage: opts.startPage || 1,
        bypassCache: true
      }, opts);
      let pageSize = options.limit = options.limit || 1500;

      return resource.findAll(filter, options)
        .then(res => {

          DEBUG('Got', res.length, 'of', resource.name, 'at page', options.startPage);

          if (res.length >= pageSize) {
            if (options.startPage > 20) {
              return $q.reject(`Page limit reached on querying "${resource.name}"`);
            }
            return loadPaged(
              resource,
              filter,
              _.assign(options, {startPage: options.startPage + 1})
            ).then(res2 => {
              Array.prototype.push.apply(res, res2);
              return res;
            });
          }

          return res;

        });

    }

    function getCount(resource, params) {

      let url = `${basePath}/${resource.endpoint}`;
      let qs = {params: _.assign({'agg:': 'count'}, params || {})};

      return $http.get(url, qs)
        .then(res => parseInt(res.headers('x-aggregate-count')));

    }

    function cachedFindAll(resource, filter, options) {

      let store = DS.store[resource.name];
      let queryHash = DSUtils.toJson(filter);
      let completed = store.queryData[queryHash];

      if (completed && !_.get(options, 'bypassCache')) {
        return $q.resolve(resource.filter(filter));
      }

      return resource.findAll(filter, _.defaults({cacheResponse: false}, options))
        .then(res => {

          // TODO: check if it's all correct

          _.each(res, item => {
            let existing = store.index[item.id];
            if (existing) {
              DSUtils.forOwn(item, (val, key) => existing[key] = val);
            } else {
              store.index[item.id] = item;
              store.collection.push(item);
            }
          });

          if (!_.get(options, 'bypassCache')) {
            store.queryData[queryHash] = {$$injected: true};
          }

          return res;

        });
    }

    function unCachedSave(definition, _id, options) {

      let resource = DS.store[definition.name];

      let id = _.get(_id, 'id') || _id;

      function shouldKeep(key) {
        return (options.keepChanges || []).indexOf(key) >= 0;
      }

      return definition.save(id, _.assign({cacheResponse: false}, options))
        .then(serverItem => {

          let localItem = resource.index[id];

          DSUtils.forOwn(serverItem, (val, key) => shouldKeep(key) || (localItem[key] = val));

          resource.saved[id] = DSUtils.updateTimestamp(resource.saved[id]);
          resource.previousAttributes[id] = DSUtils.copy(serverItem, null, null, null, definition.relationFields);

        })
    }

    function groupBy(params, groupByColumns) {

      return $q((resolve, reject) => {

        let options = {
          cacheResponse: false,
          groupBy: groupByColumns,
          afterFindAll: (options, data) => {
            resolve(data);
            return [];
          }
        };

        this.findAll(params, options)
          .catch(reject);

      });

    }

    const schema = saSchema({

      getCount,
      groupBy,
      copyInstance,

      loadPaged: function (filter, options) {
        return loadPaged(this, filter, options)
      },

      cachedFindAll: function (filter, options) {
        return cachedFindAll(this, filter, options)
      },

      unCachedSave: function (filter, options) {
        return unCachedSave(this, filter, options)
      },

      primaryIndex: function () {
        return DS.store[this.name].index;
      },

      parseBool: val => val == 1,
      parseDecimal: val => parseFloat(val) || 0,
      parseInteger: val => parseInt(val) || 0,
      parseDate: val => val ? val.substr(0, 10) : null,
      parseJson: angular.fromJson

    });

    $window.saSchema = schema;

    return schema;

  }

  function copyInstance(instance) {

    let source = _.omit(instance, this.omit);

    delete source.id;

    let res = this.createInstance();

    _.forOwn(source, (val,key) => {
      if (_.isObject(val) || _.isFunction(val)) return;
      res[key] = val;
    });

    return res;

  }

  function registerAdapters($window, DS, IosAdapter, SocketAdapter, Schema, InitService) {

    _.assign(DS.defaults, {
      watchChanges: false,
      instanceEvents: false,
      omit: ['ts', 'cts', 'deviceTs', 'deviceCts', 'deviceAts', 'lts']
    });

    if ($window.webkit) {
      const iosAdapter = new IosAdapter(Schema);
      DS.registerAdapter('ios', iosAdapter, {default: true});
    } else {
      InitService.then(app => {
        DS.registerAdapter('socket', new SocketAdapter({pool: app.org}), {default: true});
      });
    }

    $window.saDS = DS;

  }

})();
