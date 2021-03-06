function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path2;

function _path() {
  return _path2 = _interopRequireDefault(require('path'));
}

var _assert2;

function _assert() {
  return _assert2 = _interopRequireDefault(require('assert'));
}

var _constants2;

function _constants() {
  return _constants2 = require('./constants');
}

var EXTENSIONS = new Set(['ml', 'mli']);

module.exports = {
  priority: 20,
  providerName: 'nuclide-ocaml',
  getSuggestionForWord: _asyncToGenerator(function* (textEditor, text, range) {
    var _require = require('../../nuclide-client');

    var getServiceByNuclideUri = _require.getServiceByNuclideUri;

    if (!(_constants2 || _constants()).GRAMMARS.has(textEditor.getGrammar().scopeName)) {
      return null;
    }

    var file = textEditor.getPath();

    if (file == null) {
      return null;
    }

    var kind = 'ml';
    var extension = (_path2 || _path()).default.extname(file);
    if (EXTENSIONS.has(extension)) {
      kind = extension;
    }

    var instance = yield getServiceByNuclideUri('MerlinService', file);
    (0, (_assert2 || _assert()).default)(instance);
    var start = range.start;

    return {
      range: range,
      callback: _asyncToGenerator(function* () {
        yield instance.pushNewBuffer(file, textEditor.getText());
        var location = yield instance.locate(file, start.row, start.column, kind);
        if (!location) {
          return;
        }

        var _require2 = require('../../nuclide-atom-helpers');

        var goToLocation = _require2.goToLocation;

        goToLocation(location.file, location.pos.line - 1, location.pos.col);
      })
    };
  })
};