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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports['default'] = createHealthGadget;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _uiHealthPaneItemComponent = require('./ui/HealthPaneItemComponent');

var _uiHealthPaneItemComponent2 = _interopRequireDefault(_uiHealthPaneItemComponent);

var _reactForAtom = require('react-for-atom');

function createHealthGadget(state$) {

  return (function (_React$Component) {
    _inherits(HealthPaneItem, _React$Component);

    _createClass(HealthPaneItem, null, [{
      key: 'gadgetId',
      value: 'nuclide-health',
      enumerable: true
    }]);

    function HealthPaneItem() {
      _classCallCheck(this, HealthPaneItem);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _get(Object.getPrototypeOf(HealthPaneItem.prototype), 'constructor', this).apply(this, args);
      this.state = {};
    }

    _createClass(HealthPaneItem, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this = this;

        this._stateSubscription = state$.subscribe(function (state) {
          return _this.setState(state || {});
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._stateSubscription.unsubscribe();
      }
    }, {
      key: 'getTitle',
      value: function getTitle() {
        return 'Health';
      }
    }, {
      key: 'getIconName',
      value: function getIconName() {
        return 'dashboard';
      }

      // Return false to prevent the tab getting split (since we only update a singleton health pane).
    }, {
      key: 'copy',
      value: function copy() {
        return false;
      }
    }, {
      key: 'render',
      value: function render() {
        var _state = this.state;
        var stats = _state.stats;
        var activeHandleObjects = _state.activeHandleObjects;

        if (stats == null || activeHandleObjects == null) {
          return _reactForAtom.React.createElement('div', null);
        }

        return _reactForAtom.React.createElement(
          'div',
          { className: 'pane-item padded nuclide-health-pane-item' },
          _reactForAtom.React.createElement(_uiHealthPaneItemComponent2['default'], {
            cpuPercentage: stats.cpuPercentage,
            heapPercentage: stats.heapPercentage,
            memory: stats.rss,
            lastKeyLatency: stats.lastKeyLatency,
            activeHandles: activeHandleObjects.length,
            activeHandleObjects: activeHandleObjects,
            activeRequests: stats.activeRequests
          })
        );
      }
    }]);

    return HealthPaneItem;
  })(_reactForAtom.React.Component);
}

module.exports = exports['default'];