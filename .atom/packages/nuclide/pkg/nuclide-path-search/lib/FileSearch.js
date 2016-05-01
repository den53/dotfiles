Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var fileSearchForDirectory = _asyncToGenerator(function* (directoryUri, pathSetUpdater) {
  var fileSearch = fileSearchForDirectoryUri[directoryUri];
  if (fileSearch) {
    return fileSearch;
  }

  var realpath = yield _nuclideCommons.fsPromise.realpath((0, _nuclideRemoteUri.parse)(directoryUri).path);
  var paths = yield (0, _PathSetFactory.getPaths)(realpath);
  var pathSet = new _PathSet.PathSet(paths);

  var thisPathSetUpdater = pathSetUpdater || getPathSetUpdater();
  try {
    yield thisPathSetUpdater.startUpdatingPathSet(pathSet, realpath);
  } catch (e) {
    logger.warn('Could not update path sets for ' + realpath + '. Searches may be stale', e);
    // TODO(hansonw): Fall back to manual refresh or node watches
  }

  // TODO: Stop updating the pathSet when the fileSearch is torn down. But
  // currently the fileSearch is never torn down.

  fileSearch = new FileSearch(directoryUri, pathSet);
  fileSearchForDirectoryUri[directoryUri] = fileSearch;
  return fileSearch;
});

exports.fileSearchForDirectory = fileSearchForDirectory;

// The return values of the following functions must be JSON-serializable so they
// can be sent across a process boundary.

var initFileSearchForDirectory = _asyncToGenerator(function* (directoryUri) {
  yield fileSearchForDirectory(directoryUri);
});

exports.initFileSearchForDirectory = initFileSearchForDirectory;

var doSearch = _asyncToGenerator(function* (directoryUri, query) {
  var fileSearch = yield fileSearchForDirectory(directoryUri);
  return fileSearch.query(query);
});

exports.doSearch = doSearch;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _nuclideRemoteUri = require('../../nuclide-remote-uri');

var _nuclideCommons = require('../../nuclide-commons');

var _nuclideLogging = require('../../nuclide-logging');

var _PathSet = require('./PathSet');

var _PathSetFactory = require('./PathSetFactory');

var _PathSetUpdater = require('./PathSetUpdater');

var _PathSetUpdater2 = _interopRequireDefault(_PathSetUpdater);

var logger = (0, _nuclideLogging.getLogger)();

var FileSearch = (function () {
  function FileSearch(fullUri, pathSet) {
    _classCallCheck(this, FileSearch);

    this._originalUri = fullUri;
    this._pathSet = pathSet;
  }

  _createClass(FileSearch, [{
    key: 'query',
    value: _asyncToGenerator(function* (_query) {
      var _this = this;

      var results = this._pathSet.match(_query).map(function (result) {
        var matchIndexes = result.matchIndexes;

        if (matchIndexes != null) {
          matchIndexes = matchIndexes.map(function (idx) {
            return idx + _this._originalUri.length + 1;
          });
        }
        return {
          score: result.score,
          path: (0, _urlJoin2['default'])(_this._originalUri, '/', result.value),
          matchIndexes: matchIndexes || []
        };
      });
      return results;
    })
  }]);

  return FileSearch;
})();

var fileSearchForDirectoryUri = {};

var pathSetUpdater = undefined;

function getPathSetUpdater() {
  if (!pathSetUpdater) {
    exports.pathSetUpdater = pathSetUpdater = new _PathSetUpdater2['default']();
  }
  return pathSetUpdater;
}