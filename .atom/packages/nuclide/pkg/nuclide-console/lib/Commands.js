Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ActionTypes = require('./ActionTypes');

var ActionTypes = _interopRequireWildcard(_ActionTypes);

var _getCurrentExecutorId = require('./getCurrentExecutorId');

var _getCurrentExecutorId2 = _interopRequireDefault(_getCurrentExecutorId);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var Commands = (function () {
  function Commands(observer, getState) {
    _classCallCheck(this, Commands);

    this._observer = observer;
    this._getState = getState;
  }

  _createClass(Commands, [{
    key: 'clearRecords',
    value: function clearRecords() {
      this._observer.next({
        type: ActionTypes.RECORDS_CLEARED
      });
    }

    /**
     * Execute the provided code using the current executor.
     */
  }, {
    key: 'execute',
    value: function execute(code) {
      var currentExecutorId = (0, _getCurrentExecutorId2['default'])(this._getState());
      (0, _assert2['default'])(currentExecutorId);

      var executor = this._getState().executors.get(currentExecutorId);
      (0, _assert2['default'])(executor != null);

      // TODO: Is this the best way to do this? Might want to go through nuclide-executors and have
      //       that register output sources?
      this._observer.next({
        type: ActionTypes.MESSAGE_RECEIVED,
        payload: {
          record: {
            kind: 'request',
            level: 'log',
            text: code,
            scopeName: executor.scopeName
          }
        }
      });

      this._observer.next({
        type: ActionTypes.EXECUTE,
        payload: {
          executorId: currentExecutorId,
          code: code
        }
      });
    }
  }, {
    key: 'registerExecutor',
    value: function registerExecutor(executor) {
      this._observer.next({
        type: ActionTypes.REGISTER_EXECUTOR,
        payload: { executor: executor }
      });
      this._registerRecordProvider({
        source: executor.id,
        records: executor.output.map(function (message) {
          return _extends({}, message, {
            kind: 'response',
            source: executor.id,
            scopeName: null });
        })
      });
    }
  }, {
    key: 'registerOutputProvider',
    // The output won't be in the language's grammar.
    value: function registerOutputProvider(outputProvider) {
      // Transform the messages into actions and merge them into the action stream.
      // TODO: Add enabling/disabling of registered source and only subscribe when enabled. That
      //       way, we won't trigger cold observer side-effects when we don't need the results.
      return this._registerRecordProvider(_extends({}, outputProvider, {
        records: outputProvider.messages.map(function (message) {
          return _extends({}, message, {
            kind: 'message',
            source: outputProvider.source,
            scopeName: null
          });
        })
      }));
    }
  }, {
    key: '_registerRecordProvider',
    value: function _registerRecordProvider(recordProvider) {
      var _this = this;

      // Transform the messages into actions and merge them into the action stream.
      // TODO: Add enabling/disabling of registered source and only subscribe when enabled. That
      //       way, we won't trigger cold observer side-effects when we don't need the results.
      var subscription = recordProvider.records.map(function (record) {
        return {
          type: ActionTypes.MESSAGE_RECEIVED,
          payload: { record: record }
        };
      }).subscribe(function (action) {
        return _this._observer.next(action);
      });

      this._observer.next({
        type: ActionTypes.PROVIDER_REGISTERED,
        payload: {
          recordProvider: recordProvider,
          subscription: subscription
        }
      });
    }
  }, {
    key: 'removeSource',
    value: function removeSource(source) {
      var subscription = this._getState().providerSubscriptions.get(source);
      if (subscription == null) {
        return;
      }
      subscription.unsubscribe();
      this._observer.next({
        type: ActionTypes.SOURCE_REMOVED,
        payload: { source: source }
      });
    }
  }, {
    key: 'selectExecutor',
    value: function selectExecutor(executorId) {
      this._observer.next({
        type: ActionTypes.SELECT_EXECUTOR,
        payload: { executorId: executorId }
      });
    }
  }, {
    key: 'setMaxMessageCount',
    value: function setMaxMessageCount(maxMessageCount) {
      this._observer.next({
        type: ActionTypes.MAX_MESSAGE_COUNT_UPDATED,
        payload: { maxMessageCount: maxMessageCount }
      });
    }
  }, {
    key: 'unregisterExecutor',
    value: function unregisterExecutor(executor) {
      this._observer.next({
        type: ActionTypes.UNREGISTER_EXECUTOR,
        payload: { executor: executor }
      });
      this.removeSource(executor.id);
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];