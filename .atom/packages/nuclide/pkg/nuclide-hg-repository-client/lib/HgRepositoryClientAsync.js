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

var _nuclideHgRepositoryBaseLibHgConstants = require('../../nuclide-hg-repository-base/lib/hg-constants');

/*
 * Delegate to the passed in HgRepositoryClient.
 */

var HgRepositoryClientAsync = (function () {
  function HgRepositoryClientAsync(client) {
    _classCallCheck(this, HgRepositoryClientAsync);

    this._client = client;
  }

  _createClass(HgRepositoryClientAsync, [{
    key: 'getType',
    value: function getType() {
      return this._client.getType();
    }
  }, {
    key: 'getWorkingDirectory',
    value: function getWorkingDirectory() {
      return this._client.getWorkingDirectory();
    }
  }, {
    key: 'checkoutReference',
    value: function checkoutReference(reference, create) {
      return this._client._service.checkout(reference, create);
    }
  }, {
    key: 'getShortHead',
    value: _asyncToGenerator(function* () {
      var newlyFetchedBookmark = '';
      try {
        newlyFetchedBookmark = yield this._client._service.fetchCurrentBookmark();
      } catch (e) {
        // Suppress the error. There are legitimate times when there may be no
        // current bookmark, such as during a rebase. In this case, we just want
        // to return an empty string if there is no current bookmark.
      }
      if (newlyFetchedBookmark !== this._client._currentBookmark) {
        this._client._currentBookmark = newlyFetchedBookmark;
        // The Atom status-bar uses this as a signal to refresh the 'shortHead'.
        // There is currently no dedicated 'shortHeadDidChange' event.
        this._client._emitter.emit('did-change-statuses');
      }
      return this._client._currentBookmark || '';
    })
  }, {
    key: 'getCachedPathStatus',
    value: function getCachedPathStatus(filePath) {
      return Promise.resolve(this._client.getCachedPathStatus(filePath));
    }

    // TODO This is a stub.
  }, {
    key: 'getCachedUpstreamAheadBehindCount',
    value: function getCachedUpstreamAheadBehindCount(path) {
      return Promise.resolve(this._client.getCachedUpstreamAheadBehindCount(path));
    }
  }, {
    key: 'getDiffStats',
    value: _asyncToGenerator(function* (filePath) {
      var cleanStats = { added: 0, deleted: 0 };
      if (!filePath) {
        return cleanStats;
      }

      // Check the cache.
      var cachedDiffInfo = this._client._hgDiffCache[filePath];
      if (cachedDiffInfo) {
        return { added: cachedDiffInfo.added, deleted: cachedDiffInfo.deleted };
      }

      // Fall back to a fetch.
      var fetchedPathToDiffInfo = yield this._client._updateDiffInfo([filePath]);
      if (fetchedPathToDiffInfo) {
        var diffInfo = fetchedPathToDiffInfo.get(filePath);
        if (diffInfo != null) {
          return { added: diffInfo.added, deleted: diffInfo.deleted };
        }
      }

      return cleanStats;
    })

    /**
     * Recommended method to use to get the line diffs of files in this repo.
     * @param path The absolute file path to get the line diffs for. If the path \
     *   is not in the project, an empty Array will be returned.
     */
  }, {
    key: 'getLineDiffs',
    value: _asyncToGenerator(function* (filePath) {
      var lineDiffs = [];
      if (!filePath) {
        return lineDiffs;
      }

      // Check the cache.
      var cachedDiffInfo = this._client._hgDiffCache[filePath];
      if (cachedDiffInfo) {
        return cachedDiffInfo.lineDiffs;
      }

      // Fall back to a fetch.
      var fetchedPathToDiffInfo = yield this._client._updateDiffInfo([filePath]);
      if (fetchedPathToDiffInfo != null) {
        var diffInfo = fetchedPathToDiffInfo.get(filePath);
        if (diffInfo != null) {
          return diffInfo.lineDiffs;
        }
      }

      return lineDiffs;
    })
  }, {
    key: 'refreshStatus',
    value: _asyncToGenerator(function* () {
      var repoRoot = this._client.getWorkingDirectory();
      var repoProjects = atom.project.getPaths().filter(function (projPath) {
        return projPath.startsWith(repoRoot);
      });
      yield this._client.getStatuses(repoProjects, {
        hgStatusOption: _nuclideHgRepositoryBaseLibHgConstants.HgStatusOption.ONLY_NON_IGNORED
      });
    })

    /**
     * Return relative paths to status code number values object.
     * matching `GitRepositoryAsync` implementation.
     */
  }, {
    key: 'getCachedPathStatuses',
    value: function getCachedPathStatuses() {
      var absoluteCodePaths = this._client.getAllPathStatuses();
      var relativeCodePaths = {};
      for (var absolutePath in absoluteCodePaths) {
        var relativePath = this._client.relativize(absolutePath);
        relativeCodePaths[relativePath] = absoluteCodePaths[absolutePath];
      }
      return relativeCodePaths;
    }
  }, {
    key: 'isPathIgnored',
    value: function isPathIgnored(filePath) {
      return Promise.resolve(this._client.isPathIgnored(filePath));
    }
  }, {
    key: 'isStatusStaged',
    value: function isStatusStaged(status) {
      return false;
    }
  }, {
    key: 'isStatusIgnored',
    value: function isStatusIgnored(status) {
      return status === _nuclideHgRepositoryBaseLibHgConstants.StatusCodeNumber.IGNORED;
    }
  }, {
    key: 'isStatusModified',
    value: function isStatusModified(status) {
      return status === _nuclideHgRepositoryBaseLibHgConstants.StatusCodeNumber.MODIFIED;
    }
  }, {
    key: 'isStatusDeleted',
    value: function isStatusDeleted(status) {
      return status === _nuclideHgRepositoryBaseLibHgConstants.StatusCodeNumber.MISSING || status === _nuclideHgRepositoryBaseLibHgConstants.StatusCodeNumber.REMOVED;
    }
  }, {
    key: 'isStatusNew',
    value: function isStatusNew(status) {
      return status === _nuclideHgRepositoryBaseLibHgConstants.StatusCodeNumber.ADDED || status === _nuclideHgRepositoryBaseLibHgConstants.StatusCodeNumber.UNTRACKED;
    }
  }, {
    key: 'onDidChangeStatus',
    value: function onDidChangeStatus(callback) {
      return this._client.onDidChangeStatus(callback);
    }
  }, {
    key: 'onDidChangeStatuses',
    value: function onDidChangeStatuses(callback) {
      return this._client.onDidChangeStatuses(callback);
    }
  }]);

  return HgRepositoryClientAsync;
})();

exports['default'] = HgRepositoryClientAsync;
module.exports = exports['default'];