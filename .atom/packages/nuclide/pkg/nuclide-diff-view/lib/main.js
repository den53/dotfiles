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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _types = require('./types');

Object.defineProperty(exports, 'UIElement', {
  enumerable: true,
  get: function get() {
    return _types.UIElement;
  }
});
Object.defineProperty(exports, 'UIProvider', {
  enumerable: true,
  get: function get() {
    return _types.UIProvider;
  }
});

var _atom2;

function _atom() {
  return _atom2 = require('atom');
}

var _reactForAtom2;

function _reactForAtom() {
  return _reactForAtom2 = require('react-for-atom');
}

var _assert2;

function _assert() {
  return _assert2 = _interopRequireDefault(require('assert'));
}

var _url2;

function _url() {
  return _url2 = _interopRequireDefault(require('url'));
}

var _libNuclideFeatures2;

function _libNuclideFeatures() {
  return _libNuclideFeatures2 = require('../../../lib/nuclide-features');
}

var _nuclideAtomHelpers2;

function _nuclideAtomHelpers() {
  return _nuclideAtomHelpers2 = require('../../nuclide-atom-helpers');
}

var _nuclideHgGitBridge2;

function _nuclideHgGitBridge() {
  return _nuclideHgGitBridge2 = require('../../nuclide-hg-git-bridge');
}

var _nuclideLogging2;

function _nuclideLogging() {
  return _nuclideLogging2 = require('../../nuclide-logging');
}

var _constants2;

function _constants() {
  return _constants2 = require('./constants');
}

var _DiffViewElement2;

function _DiffViewElement() {
  return _DiffViewElement2 = _interopRequireDefault(require('./DiffViewElement'));
}

var diffViewModel = null;
var activeDiffView = null;

// This url style is the one Atom uses for the welcome and settings pages.
var NUCLIDE_DIFF_VIEW_URI = 'atom://nuclide/diff-view';
var DIFF_VIEW_FILE_TREE_CONTEXT_MENU_PRIORITY = 1000;
var COMMIT_FILE_TREE_CONTEXT_MENU_PRIORITY = 1100;
var AMEND_FILE_TREE_CONTEXT_MENU_PRIORITY = 1200;
var PUBLISH_FILE_TREE_CONTEXT_MENU_PRIORITY = 1300;

var uiProviders = [];

var subscriptions = null;
var toolBar = null;
var changeCountElement = null;
var cwdApi = null;

function formatDiffViewUrl(diffEntityOptions) {
  if (diffEntityOptions == null) {
    diffEntityOptions = { file: '' };
  }
  return (_url2 || _url()).default.format({
    protocol: 'atom',
    host: 'nuclide',
    pathname: 'diff-view',
    slashes: true,
    query: diffEntityOptions
  });
}

// To add a View as an Atom workspace pane, we return `DiffViewElement` which extends `HTMLElement`.
// This pattetn is also followed with atom's TextEditor.
function createView(diffEntityOptions) {
  if (activeDiffView) {
    activateDiffPath(diffEntityOptions);
    return activeDiffView.element;
  }
  var DiffViewComponent = require('./DiffViewComponent');

  var diffModel = getDiffViewModel();
  diffModel.activate();
  var hostElement = new (_DiffViewElement2 || _DiffViewElement()).default().initialize(diffModel, NUCLIDE_DIFF_VIEW_URI);
  var component = (_reactForAtom2 || _reactForAtom()).ReactDOM.render((_reactForAtom2 || _reactForAtom()).React.createElement(DiffViewComponent, { diffModel: diffModel }), hostElement);
  activeDiffView = {
    component: component,
    element: hostElement
  };
  activateDiffPath(diffEntityOptions);

  var destroySubscription = hostElement.onDidDestroy(function () {
    (_reactForAtom2 || _reactForAtom()).ReactDOM.unmountComponentAtNode(hostElement);
    diffModel.deactivate();
    destroySubscription.dispose();
    (0, (_assert2 || _assert()).default)(subscriptions);
    subscriptions.remove(destroySubscription);
    activeDiffView = null;
  });

  (0, (_assert2 || _assert()).default)(subscriptions);
  subscriptions.add(destroySubscription);

  var _require = require('../../nuclide-analytics');

  var track = _require.track;

  track('diff-view-open');

  return hostElement;
}

function getDiffViewModel() {
  if (diffViewModel == null) {
    var DiffViewModel = require('./DiffViewModel');
    diffViewModel = new DiffViewModel();
    diffViewModel.setUiProviders(uiProviders);
    (0, (_assert2 || _assert()).default)(subscriptions);
    subscriptions.add(diffViewModel);
  }
  return diffViewModel;
}

function activateDiffPath(diffEntityOptions) {
  if (diffViewModel == null) {
    return;
  }
  if (!diffEntityOptions.file && !diffEntityOptions.directory && cwdApi != null) {
    var directory = cwdApi.getCwd();
    if (directory != null) {
      diffEntityOptions.directory = directory.getPath();
    }
  }
  diffViewModel.diffEntity(diffEntityOptions);
}

function projectsContainPath(checkPath) {
  var _require2 = require('../../nuclide-remote-uri');

  var isRemote = _require2.isRemote;

  return atom.project.getDirectories().some(function (directory) {
    var directoryPath = directory.getPath();
    if (!checkPath.startsWith(directoryPath)) {
      return false;
    }
    // If the remote directory hasn't yet loaded.
    if (isRemote(checkPath) && directory instanceof (_atom2 || _atom()).Directory) {
      return false;
    }
    return true;
  });
}

function updateToolbarCount(diffViewButton, count) {
  if (!changeCountElement) {
    changeCountElement = document.createElement('span');
    changeCountElement.className = 'diff-view-count';
    diffViewButton.appendChild(changeCountElement);
  }
  if (count > 0) {
    diffViewButton.classList.add('positive-count');
  } else {
    diffViewButton.classList.remove('positive-count');
  }
  var DiffCountComponent = require('./DiffCountComponent');
  (_reactForAtom2 || _reactForAtom()).ReactDOM.render((_reactForAtom2 || _reactForAtom()).React.createElement(DiffCountComponent, { count: count }), changeCountElement);
}

function diffActivePath(diffOptions) {
  var editor = atom.workspace.getActiveTextEditor();
  if (editor == null) {
    atom.workspace.open(formatDiffViewUrl(diffOptions));
  } else {
    atom.workspace.open(formatDiffViewUrl(_extends({
      file: editor.getPath() || ''
    }, diffOptions)));
  }
}

function isActiveEditorDiffable() {
  var editor = atom.workspace.getActiveTextEditor();
  if (editor == null) {
    return false;
  }
  return isPathDiffable(editor.getPath());
}

function shouldDisplayDiffTreeItem(contextMenu) {
  var node = contextMenu.getSingleSelectedNode();
  return node != null && isPathDiffable(node.uri);
}

function isPathDiffable(filePath) {
  if (filePath == null || filePath.length === 0) {
    return false;
  }
  var repository = (0, (_nuclideHgGitBridge2 || _nuclideHgGitBridge()).repositoryForPath)(filePath);
  return repository != null && repository.getType() === 'hg';
}

// Listen for file tree context menu file item events to open the diff view.
function addFileTreeCommands(commandName, diffOptions) {
  (0, (_assert2 || _assert()).default)(subscriptions);
  subscriptions.add(atom.commands.add('.tree-view .entry.file.list-item', commandName, function (event) {
    var filePath = (0, (_nuclideAtomHelpers2 || _nuclideAtomHelpers()).getUiTreePathFromTargetEvent)(event);
    atom.workspace.open(formatDiffViewUrl(_extends({
      file: filePath || ''
    }, diffOptions)));
  }));

  subscriptions.add(atom.commands.add('.tree-view .entry.directory.list-nested-item > .list-item', commandName, function (event) {
    var directoryPath = (0, (_nuclideAtomHelpers2 || _nuclideAtomHelpers()).getUiTreePathFromTargetEvent)(event);
    atom.workspace.open(formatDiffViewUrl(_extends({
      directory: directoryPath || ''
    }, diffOptions)));
  }));
}

function addActivePathCommands(commandName, diffOptions) {
  (0, (_assert2 || _assert()).default)(subscriptions);
  var boundDiffActivePath = diffActivePath.bind(null, diffOptions);
  subscriptions.add(atom.commands.add('atom-workspace', commandName, boundDiffActivePath));
  // Listen for in-editor context menu item diff view open command.
  subscriptions.add(atom.commands.add('atom-text-editor', commandName, boundDiffActivePath));
}

module.exports = Object.defineProperties({

  activate: function activate(state) {
    subscriptions = new (_atom2 || _atom()).CompositeDisposable();
    // Listen for menu item workspace diff view open command.
    addActivePathCommands('nuclide-diff-view:open');
    addActivePathCommands('nuclide-diff-view:commit', {
      viewMode: (_constants2 || _constants()).DiffMode.COMMIT_MODE,
      commitMode: (_constants2 || _constants()).CommitMode.COMMIT
    });
    addActivePathCommands('nuclide-diff-view:amend', {
      viewMode: (_constants2 || _constants()).DiffMode.COMMIT_MODE,
      commitMode: (_constants2 || _constants()).CommitMode.AMEND
    });
    addActivePathCommands('nuclide-diff-view:publish', {
      viewMode: (_constants2 || _constants()).DiffMode.PUBLISH_MODE
    });

    // Context Menu Items.
    subscriptions.add(atom.contextMenu.add({
      'atom-text-editor': [{ type: 'separator' }, {
        label: 'Source Control',
        submenu: [{
          label: 'Open in Diff View',
          command: 'nuclide-diff-view:open'
        }, {
          label: 'Commit',
          command: 'nuclide-diff-view:commit'
        }, {
          label: 'Amend',
          command: 'nuclide-diff-view:amend'
        }, {
          label: 'Publish to Phabricator',
          command: 'nuclide-diff-view:publish'
        }],
        shouldDisplay: function shouldDisplay() {
          return isActiveEditorDiffable();
        }
      }, { type: 'separator' }]
    }));

    // Listen for switching to editor mode for the active file.
    subscriptions.add(atom.commands.add('nuclide-diff-view', 'nuclide-diff-view:switch-to-editor', function () {
      var diffModel = getDiffViewModel();

      var _diffModel$getActiveFileState = diffModel.getActiveFileState();

      var filePath = _diffModel$getActiveFileState.filePath;

      if (filePath != null && filePath.length) {
        atom.workspace.open(filePath);
      }
    }));

    addFileTreeCommands('nuclide-diff-view:open-context');
    addFileTreeCommands('nuclide-diff-view:commit-context', {
      viewMode: (_constants2 || _constants()).DiffMode.COMMIT_MODE,
      commitMode: (_constants2 || _constants()).CommitMode.COMMIT
    });
    addFileTreeCommands('nuclide-diff-view:amend-context', {
      viewMode: (_constants2 || _constants()).DiffMode.COMMIT_MODE,
      commitMode: (_constants2 || _constants()).CommitMode.AMEND
    });
    addFileTreeCommands('nuclide-diff-view:publish-context', {
      viewMode: (_constants2 || _constants()).DiffMode.PUBLISH_MODE
    });

    // The Diff View will open its main UI in a tab, like Atom's preferences and welcome pages.
    subscriptions.add(atom.workspace.addOpener(function (uri) {
      if (uri.startsWith(NUCLIDE_DIFF_VIEW_URI)) {
        if (!require('semver').gte(atom.getVersion(), '1.6.1')) {
          throw new Error('Outdated Atom version<br/>\n' + '**Nuclide\'s Diff View require Atom 1.6.1 or later**');
        }

        var _default$parse = (_url2 || _url()).default.parse(uri, true);

        var diffEntityOptions = _default$parse.query;

        return createView(diffEntityOptions);
      }
    }));

    if (state == null || !state.visible) {
      return;
    }

    var activeFilePath = state.activeFilePath;
    var viewMode = state.viewMode;
    var commitMode = state.commitMode;

    // Wait for all source control providers to register.
    subscriptions.add((_libNuclideFeatures2 || _libNuclideFeatures()).nuclideFeatures.onDidActivateInitialFeatures(function () {
      function restoreActiveDiffView() {
        atom.workspace.open(formatDiffViewUrl({
          file: activeFilePath,
          viewMode: viewMode,
          commitMode: commitMode
        }));
      }

      // If it's a local directory, it must be loaded with packages activation.
      if (!activeFilePath || projectsContainPath(activeFilePath)) {
        restoreActiveDiffView();
        return;
      }
      // If it's a remote directory, it should come on a path change event.
      // The change handler is delayed to break the race with the `DiffViewModel` subscription.
      var changePathsSubscription = atom.project.onDidChangePaths(function () {
        return setTimeout(function () {
          // try/catch here because in case of any error, Atom stops dispatching events to the
          // rest of the listeners, which can stop the remote editing from being functional.
          try {
            if (projectsContainPath(activeFilePath)) {
              restoreActiveDiffView();
              changePathsSubscription.dispose();
              (0, (_assert2 || _assert()).default)(subscriptions);
              subscriptions.remove(changePathsSubscription);
            }
          } catch (e) {
            (0, (_nuclideLogging2 || _nuclideLogging()).getLogger)().error('DiffView restore error', e);
          }
        }, 10);
      });
      (0, (_assert2 || _assert()).default)(subscriptions);
      subscriptions.add(changePathsSubscription);
    }));
  },

  consumeToolBar: function consumeToolBar(getToolBar) {
    toolBar = getToolBar('nuclide-diff-view');
    var button = toolBar.addButton({
      icon: 'git-branch',
      callback: 'nuclide-diff-view:open',
      tooltip: 'Open Diff View',
      priority: 300
    })[0];
    var diffModel = getDiffViewModel();
    updateToolbarCount(button, diffModel.getState().dirtyFileChanges.size);
    (0, (_assert2 || _assert()).default)(subscriptions);
    subscriptions.add(diffModel.onDidUpdateState(function () {
      updateToolbarCount(button, diffModel.getState().dirtyFileChanges.size);
    }));
  },

  getHomeFragments: function getHomeFragments() {
    return {
      feature: {
        title: 'Diff View',
        icon: 'git-branch',
        description: (_reactForAtom2 || _reactForAtom()).React.createElement(
          'span',
          null,
          'Launches an editable side-by-side compare view across mercurial dirty and commits changes, allowing committing and pushing changes to phabricator.'
        ),
        command: 'nuclide-diff-view:open'
      },
      priority: 3
    };
  },

  serialize: function serialize() {
    if (!activeDiffView || !diffViewModel) {
      return {
        visible: false
      };
    }

    var _diffViewModel$getActiveFileState = diffViewModel.getActiveFileState();

    var filePath = _diffViewModel$getActiveFileState.filePath;

    var _diffViewModel$getState = diffViewModel.getState();

    var viewMode = _diffViewModel$getState.viewMode;
    var commitMode = _diffViewModel$getState.commitMode;

    return {
      visible: true,
      activeFilePath: filePath,
      viewMode: viewMode,
      commitMode: commitMode
    };
  },

  deactivate: function deactivate() {
    uiProviders.splice(0);
    if (subscriptions != null) {
      subscriptions.dispose();
      subscriptions = null;
    }
    if (diffViewModel != null) {
      diffViewModel.dispose();
      diffViewModel = null;
    }
    activeDiffView = null;
    if (toolBar != null) {
      toolBar.removeItems();
      toolBar = null;
    }
  },

  /**
   * The diff-view package can consume providers that return React components to
   * be rendered inline.
   * A uiProvider must have a method composeUiElements with the following spec:
   * @param filePath The path of the file the diff view is opened for
   * @return An array of InlineComments (defined above) to be rendered into the
   *         diff view
   */
  consumeUIProvider: function consumeUIProvider(provider) {
    uiProviders.push(provider);
    if (diffViewModel != null) {
      diffViewModel.setUiProviders(uiProviders);
    }
    return;
  },

  consumeCwdApi: function consumeCwdApi(api) {
    cwdApi = api;
  },

  addItemsToFileTreeContextMenu: function addItemsToFileTreeContextMenu(contextMenu) {
    (0, (_assert2 || _assert()).default)(subscriptions);
    var menuItemDescriptions = new (_atom2 || _atom()).CompositeDisposable();
    menuItemDescriptions.add(contextMenu.addItemToSourceControlMenu({
      label: 'Open in Diff View',
      command: 'nuclide-diff-view:open-context',
      shouldDisplay: function shouldDisplay() {
        return shouldDisplayDiffTreeItem(contextMenu);
      }
    }, DIFF_VIEW_FILE_TREE_CONTEXT_MENU_PRIORITY));
    menuItemDescriptions.add(contextMenu.addItemToSourceControlMenu({
      label: 'Commit',
      command: 'nuclide-diff-view:commit-context',
      shouldDisplay: function shouldDisplay() {
        return shouldDisplayDiffTreeItem(contextMenu);
      }
    }, COMMIT_FILE_TREE_CONTEXT_MENU_PRIORITY));
    menuItemDescriptions.add(contextMenu.addItemToSourceControlMenu({
      label: 'Amend',
      command: 'nuclide-diff-view:amend-context',
      shouldDisplay: function shouldDisplay() {
        return shouldDisplayDiffTreeItem(contextMenu);
      }
    }, AMEND_FILE_TREE_CONTEXT_MENU_PRIORITY));
    menuItemDescriptions.add(contextMenu.addItemToSourceControlMenu({
      label: 'Publish to Phabricator',
      command: 'nuclide-diff-view:publish-context',
      shouldDisplay: function shouldDisplay() {
        return shouldDisplayDiffTreeItem(contextMenu);
      }
    }, PUBLISH_FILE_TREE_CONTEXT_MENU_PRIORITY));

    subscriptions.add(menuItemDescriptions);

    // We don't need to dispose of the menuItemDescriptions when the provider is disabled -
    // it needs to be handled by the provider itself. We only should remove it from the list
    // of the disposables we maintain.
    return new (_atom2 || _atom()).Disposable(function () {
      if (subscriptions != null) {
        subscriptions.remove(menuItemDescriptions);
      }
    });
  }

}, {
  __testDiffView: {
    get: function get() {
      return activeDiffView;
    },
    configurable: true,
    enumerable: true
  }
});