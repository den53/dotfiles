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

var _outline2;

function _outline() {
  return _outline2 = require('./outline');
}

var _config2;

function _config() {
  return _config2 = require('./config');
}

var PythonOutlineProvider = (function () {
  function PythonOutlineProvider() {
    _classCallCheck(this, PythonOutlineProvider);
  }

  _createClass(PythonOutlineProvider, [{
    key: 'getOutline',
    value: _asyncToGenerator(function* (editor) {
      return (0, (_outline2 || _outline()).pythonTextToOutline)((0, (_config2 || _config()).getShowGlobalVariables)(), editor.getText());
    })
  }]);

  return PythonOutlineProvider;
})();

exports.PythonOutlineProvider = PythonOutlineProvider;