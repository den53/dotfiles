Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _CwdApi = require('./CwdApi');

var _atom = require('atom');

var Activation = (function () {
  function Activation(rawState) {
    _classCallCheck(this, Activation);

    var state = rawState || {};
    var initialCwdPath = state.initialCwdPath;

    this._cwdApi = new _CwdApi.CwdApi(initialCwdPath);
    this._disposables = new _atom.CompositeDisposable(this._cwdApi);
  }

  _createClass(Activation, [{
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }, {
    key: 'provideApi',
    value: function provideApi() {
      return this._cwdApi;
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      var cwd = this._cwdApi.getCwd();
      return {
        initialCwdPath: cwd == null ? null : cwd.getPath()
      };
    }
  }]);

  return Activation;
})();

exports.Activation = Activation;