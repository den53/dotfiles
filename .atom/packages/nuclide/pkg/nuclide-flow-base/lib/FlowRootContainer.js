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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rxjs2;

function _rxjs() {
  return _rxjs2 = require('rxjs');
}

var _FlowHelpers2;

function _FlowHelpers() {
  return _FlowHelpers2 = require('./FlowHelpers');
}

var _FlowRoot2;

function _FlowRoot() {
  return _FlowRoot2 = require('./FlowRoot');
}

var FlowRootContainer = (function () {
  function FlowRootContainer() {
    var _this = this;

    _classCallCheck(this, FlowRootContainer);

    this._flowRootMap = new Map();

    // No need to dispose of this subscription since we want to keep it for the entire life of this
    // object. When this object is garbage collected the subject should be too.
    this._flowRoot$ = new (_rxjs2 || _rxjs()).Subject();
    this._flowRoot$.subscribe(function (flowRoot) {
      _this._flowRootMap.set(flowRoot.getPathToRoot(), flowRoot);
    });
  }

  _createClass(FlowRootContainer, [{
    key: 'getRootForPath',
    value: _asyncToGenerator(function* (path) {
      var rootPath = yield (0, (_FlowHelpers2 || _FlowHelpers()).findFlowConfigDir)(path);
      if (rootPath == null) {
        return null;
      }

      var instance = this._flowRootMap.get(rootPath);
      if (!instance) {
        instance = new (_FlowRoot2 || _FlowRoot()).FlowRoot(rootPath);
        this._flowRoot$.next(instance);
      }
      return instance;
    })
  }, {
    key: 'runWithRoot',
    value: _asyncToGenerator(function* (file, f) {
      var instance = yield this.getRootForPath(file);
      if (instance == null) {
        return null;
      }

      return yield f(instance);
    })
  }, {
    key: 'getAllRoots',
    value: function getAllRoots() {
      return this._flowRootMap.values();
    }
  }, {
    key: 'getServerStatusUpdates',
    value: function getServerStatusUpdates() {
      return this._flowRoot$.flatMap(function (root) {
        var pathToRoot = root.getPathToRoot();
        // The status update stream will be completed when a root is disposed, so there is no need to
        // use takeUntil here to truncate the stream and release resources.
        return root.getServerStatusUpdates().map(function (status) {
          return { pathToRoot: pathToRoot, status: status };
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._flowRootMap.forEach(function (instance) {
        return instance.dispose();
      });
      this._flowRootMap.clear();
    }
  }]);

  return FlowRootContainer;
})();

exports.FlowRootContainer = FlowRootContainer;

// string rather than NuclideUri because this module will always execute at the location of the
// file, so it will always be a real path and cannot be prefixed with nuclide://