var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var invariant = require('assert');

var _require = require('atom');

var CompositeDisposable = _require.CompositeDisposable;
var Disposable = _require.Disposable;
var Emitter = _require.Emitter;
var Point = _require.Point;

var DEBOUNCE_TIME = 200;

var WindowMouseListener = (function () {
  function WindowMouseListener() {
    var _this = this;

    _classCallCheck(this, WindowMouseListener);

    this._subscriptions = new CompositeDisposable();

    var _require2 = require('../../nuclide-commons');

    var debounce = _require2.debounce;

    var handler = debounce(function (event) {
      return _this._handleMouseMove(event);
    }, DEBOUNCE_TIME,
    /* immediate */true);
    window.addEventListener('mousemove', handler);
    this._mouseMoveListener = new Disposable(function () {
      window.removeEventListener('mousemove', handler);
    });

    this._textEditorMouseListenersMap = new Map();
    this._textEditorMouseListenersCountMap = new Map();
    this._subscriptions.add(new Disposable(function () {
      _this._textEditorMouseListenersMap.forEach(function (listener) {
        return listener.dispose();
      });
      _this._textEditorMouseListenersMap.clear();
      _this._textEditorMouseListenersCountMap.clear();
    }));
  }

  _createClass(WindowMouseListener, [{
    key: 'mouseListenerForTextEditor',
    value: function mouseListenerForTextEditor(textEditor) {
      var _this2 = this;

      // Keep track of how many mouse listeners were returned for the text editor
      // so we know when it's safe to actually dispose it.
      var count = this._textEditorMouseListenersCountMap.get(textEditor) || 0;
      this._textEditorMouseListenersCountMap.set(textEditor, count + 1);

      var mouseListener = this._textEditorMouseListenersMap.get(textEditor);
      if (!mouseListener) {
        (function () {
          mouseListener = new TextEditorMouseListener(textEditor, /* shouldDispose */function () {
            var currentCount = _this2._textEditorMouseListenersCountMap.get(textEditor) || 0;
            if (currentCount === 1) {
              _this2._textEditorMouseListenersCountMap['delete'](textEditor);
              _this2._textEditorMouseListenersMap['delete'](textEditor);
              return true;
            } else {
              _this2._textEditorMouseListenersCountMap.set(textEditor, currentCount - 1);
              return false;
            }
          });
          _this2._textEditorMouseListenersMap.set(textEditor, mouseListener);

          var destroySubscription = textEditor.onDidDestroy(function () {
            // $FlowIssue: There is no way for this to become null.
            mouseListener.dispose();
            _this2._textEditorMouseListenersMap['delete'](textEditor);
            _this2._textEditorMouseListenersCountMap['delete'](textEditor);
            destroySubscription.dispose();
          });
        })();
      }
      return mouseListener;
    }
  }, {
    key: '_handleMouseMove',
    value: function _handleMouseMove(event) {
      this._textEditorMouseListenersMap.forEach(function (mouseListener) {
        return mouseListener._handleMouseMove(event);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
      if (this._mouseMoveListener) {
        this._mouseMoveListener.dispose();
      }
    }
  }]);

  return WindowMouseListener;
})();

var TextEditorMouseListener = (function () {
  function TextEditorMouseListener(textEditor, shouldDispose) {
    _classCallCheck(this, TextEditorMouseListener);

    this._textEditor = textEditor;
    this._textEditorView = atom.views.getView(this._textEditor);

    this._shouldDispose = shouldDispose;
    this._subscriptions = new CompositeDisposable();

    this._emitter = new Emitter();
    this._subscriptions.add(this._emitter);

    this._lastPosition = new Point(0, 0);
  }

  /**
   * Returns the last known text editor screen position under the mouse,
   * initialized to (0, 0).
   */

  _createClass(TextEditorMouseListener, [{
    key: 'getLastPosition',
    value: function getLastPosition() {
      return this._lastPosition;
    }

    /**
     * Calls `fn` when the mouse moves onto another text editor screen position,
     * not pixel position.
     */
  }, {
    key: 'onDidPositionChange',
    value: function onDidPositionChange(fn) {
      return this._emitter.on('did-position-change', fn);
    }
  }, {
    key: 'screenPositionForMouseEvent',
    value: function screenPositionForMouseEvent(event) {
      var component = this._textEditorView.component;
      invariant(component);
      return component.screenPositionForMouseEvent(event);
    }
  }, {
    key: '_handleMouseMove',
    value: function _handleMouseMove(event) {
      var position = this.screenPositionForMouseEvent(event);
      if (position.compare(this._lastPosition) !== 0) {
        this._lastPosition = position;
        this._emitter.emit('did-position-change', {
          nativeEvent: event,
          position: position
        });
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._shouldDispose()) {
        this._subscriptions.dispose();
      }
    }
  }]);

  return TextEditorMouseListener;
})();

module.exports =
/**
 * Returns an object that tracks the mouse position in a text editor.
 *
 * The positions are in text editor screen coordinates and are rounded down
 * to the last position on each line.
 */
function mouseListenerForTextEditor(textEditor) {
  // $FlowFixMe
  atom.nuclide = atom.nuclide || {};
  atom.nuclide.windowMouseListener = atom.nuclide.windowMouseListener || new WindowMouseListener();
  return atom.nuclide.windowMouseListener.mouseListenerForTextEditor(textEditor);
};