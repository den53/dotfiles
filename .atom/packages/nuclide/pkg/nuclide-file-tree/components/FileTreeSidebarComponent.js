var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _reactForAtom = require('react-for-atom');

var _FileTree = require('./FileTree');

var _FileTreeSideBarFilterComponent = require('./FileTreeSideBarFilterComponent');

var _FileTreeSideBarFilterComponent2 = _interopRequireDefault(_FileTreeSideBarFilterComponent);

var _FileTreeToolbarComponent = require('./FileTreeToolbarComponent');

var _libFileTreeStore = require('../lib/FileTreeStore');

var _atom = require('atom');

var _nuclideUiLibPanelComponentScroller = require('../../nuclide-ui/lib/PanelComponentScroller');

var FileTreeSidebarComponent = (function (_React$Component) {
  _inherits(FileTreeSidebarComponent, _React$Component);

  function FileTreeSidebarComponent(props) {
    _classCallCheck(this, FileTreeSidebarComponent);

    _get(Object.getPrototypeOf(FileTreeSidebarComponent.prototype), 'constructor', this).call(this, props);

    this._store = _libFileTreeStore.FileTreeStore.getInstance();
    this.state = {
      shouldRenderToolbar: false,
      scrollerHeight: 0,
      scrollerScrollTop: 0
    };
    this._disposables = new _atom.CompositeDisposable();
    this._afRequestId = null;
    this._handleFocus = this._handleFocus.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._scrollToPosition = this._scrollToPosition.bind(this);
    this._processExternalUpdate = this._processExternalUpdate.bind(this);
  }

  _createClass(FileTreeSidebarComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this._processExternalUpdate();

      window.addEventListener('resize', this._onViewChange);
      this._afRequestId = window.requestAnimationFrame(function () {
        _this._onViewChange();
        _this._afRequestId = null;
      });

      this._disposables.add(this._store.subscribe(this._processExternalUpdate), atom.project.onDidChangePaths(this._processExternalUpdate), new _atom.Disposable(function () {
        window.removeEventListener('resize', _this._onViewChange);
        if (_this._afRequestId != null) {
          window.cancelAnimationFrame(_this._afRequestId);
        }
      }));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._disposables.dispose();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.hidden && !this.props.hidden) {
        this._onViewChange();
      }
    }
  }, {
    key: '_handleFocus',
    value: function _handleFocus(event) {
      // Delegate focus to the FileTree component if this component gains focus because the FileTree
      // matches the selectors targeted by themes to show the containing panel has focus.
      if (event.target === _reactForAtom.ReactDOM.findDOMNode(this)) {
        _reactForAtom.ReactDOM.findDOMNode(this.refs['fileTree']).focus();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var workingSetsStore = this._store.getWorkingSetsStore();
      var toolbar = undefined;
      if (this.state.shouldRenderToolbar && workingSetsStore != null) {
        toolbar = [_reactForAtom.React.createElement(_FileTreeSideBarFilterComponent2['default'], {
          key: 'filter',
          filter: this._store.getFilter(),
          found: this._store.getFilterFound()
        }), _reactForAtom.React.createElement(_FileTreeToolbarComponent.FileTreeToolbarComponent, {
          key: 'toolbar',
          workingSetsStore: workingSetsStore
        })];
      }

      // Include `tabIndex` so this component can be focused by calling its native `focus` method.
      return _reactForAtom.React.createElement(
        'div',
        {
          className: 'nuclide-file-tree-toolbar-container',
          onFocus: this._handleFocus,
          tabIndex: 0 },
        toolbar,
        _reactForAtom.React.createElement(
          _nuclideUiLibPanelComponentScroller.PanelComponentScroller,
          {
            ref: 'scroller',
            onScroll: this._onViewChange },
          _reactForAtom.React.createElement(_FileTree.FileTree, {
            ref: 'fileTree',
            containerHeight: this.state.scrollerHeight,
            containerScrollTop: this.state.scrollerScrollTop,
            scrollToPosition: this._scrollToPosition
          })
        )
      );
    }
  }, {
    key: '_processExternalUpdate',
    value: function _processExternalUpdate() {
      var shouldRenderToolbar = !this._store.roots.isEmpty();

      if (shouldRenderToolbar !== this.state.shouldRenderToolbar) {
        this.setState({ shouldRenderToolbar: shouldRenderToolbar });
      } else {
        // Note: It's safe to call forceUpdate here because the change events are de-bounced.
        this.forceUpdate();
      }
    }
  }, {
    key: '_onViewChange',
    value: function _onViewChange() {
      var node = _reactForAtom.ReactDOM.findDOMNode(this.refs['scroller']);
      var clientHeight = node.clientHeight;
      var scrollTop = node.scrollTop;

      if (clientHeight !== this.state.scrollerHeight || scrollTop !== this.state.scrollerScrollTop) {
        this.setState({ scrollerHeight: clientHeight, scrollerScrollTop: scrollTop });
      }
    }
  }, {
    key: '_scrollToPosition',
    value: function _scrollToPosition(top, height) {
      var _this2 = this;

      var requestedBottom = top + height;
      var currentBottom = this.state.scrollerScrollTop + this.state.scrollerHeight;
      if (top > this.state.scrollerScrollTop && requestedBottom <= currentBottom) {
        return; // Already in the view
      }

      var node = _reactForAtom.ReactDOM.findDOMNode(this.refs['scroller']);
      if (node == null) {
        return;
      }
      var newTop = Math.max(top + height / 2 - this.state.scrollerHeight / 2, 0);
      setImmediate(function () {
        try {
          // For the rather unlikely chance that the node is already gone from the DOM
          node.scrollTop = newTop;
          _this2.setState({ scrollerScrollTop: newTop });
        } catch (e) {}
      });
    }
  }]);

  return FileTreeSidebarComponent;
})(_reactForAtom.React.Component);

module.exports = FileTreeSidebarComponent;