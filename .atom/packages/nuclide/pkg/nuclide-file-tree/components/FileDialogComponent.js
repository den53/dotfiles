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

var _nuclideUiLibAtomInput = require('../../nuclide-ui/lib/AtomInput');

var _nuclideUiLibCheckbox = require('../../nuclide-ui/lib/Checkbox');

var _atom = require('atom');

var _reactForAtom = require('react-for-atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var PropTypes = _reactForAtom.React.PropTypes;

/**
 * Component that displays UI to create a new file.
 */

var FileDialogComponent = (function (_React$Component) {
  _inherits(FileDialogComponent, _React$Component);

  _createClass(FileDialogComponent, null, [{
    key: 'propTypes',
    value: {
      iconClassName: PropTypes.string,
      initialValue: PropTypes.string,
      // Message is displayed above the input.
      message: PropTypes.element.isRequired,
      // Will be called (before `onClose`) if the user confirms.  `onConfirm` will
      // be called with two arguments, the value of the input field and a map of
      // option name => bool (true if option was selected).
      onConfirm: PropTypes.func.isRequired,
      // Will be called regardless of whether the user confirms.
      onClose: PropTypes.func.isRequired,
      // Whether or not to initially select the base name of the path.
      // This is useful for renaming files.
      selectBasename: PropTypes.bool,
      // Extra options to show the user.  Key is the name of the option and value
      // is a description string that will be displayed.
      additionalOptions: PropTypes.objectOf(PropTypes.string)
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      additionalOptions: {}
    },
    enumerable: true
  }]);

  function FileDialogComponent() {
    _classCallCheck(this, FileDialogComponent);

    _get(Object.getPrototypeOf(FileDialogComponent.prototype), 'constructor', this).apply(this, arguments);
    this._isClosed = false;
    this._subscriptions = new _atom.CompositeDisposable();
    this._close = this._close.bind(this);
    this._confirm = this._confirm.bind(this);
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
    this.state = {
      options: {}
    };
    for (var _name in this.props.additionalOptions) {
      this.state.options[_name] = true;
    }
  }

  _createClass(FileDialogComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var input = this.refs.input;
      this._subscriptions.add(atom.commands.add(_reactForAtom.ReactDOM.findDOMNode(input), {
        'core:confirm': this._confirm,
        'core:cancel': this._close
      }));
      var path = this.props.initialValue;
      input.focus();
      if (this.props.selectBasename) {
        var _pathModule$parse = _path2['default'].parse(path);

        var dir = _pathModule$parse.dir;
        var _name2 = _pathModule$parse.name;

        var selectionStart = dir ? dir.length + 1 : 0;
        var selectionEnd = selectionStart + _name2.length;
        input.getTextEditor().setSelectedBufferRange([[0, selectionStart], [0, selectionEnd]]);
      }
      document.addEventListener('click', this._handleDocumentClick);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._subscriptions.dispose();
      document.removeEventListener('click', this._handleDocumentClick);
    }
  }, {
    key: 'render',
    value: function render() {
      var labelClassName = undefined;
      if (this.props.iconClassName != null) {
        labelClassName = 'icon ' + this.props.iconClassName;
      }

      var checkboxes = [];
      for (var _name3 in this.props.additionalOptions) {
        var message = this.props.additionalOptions[_name3];
        var checked = this.state.options[_name3];
        var checkbox = _reactForAtom.React.createElement(_nuclideUiLibCheckbox.Checkbox, {
          key: _name3,
          checked: checked,
          onChange: this._handleAdditionalOptionChanged.bind(this, _name3),
          label: message
        });
        checkboxes.push(checkbox);
      }

      // `.tree-view-dialog` is unstyled but is added by Atom's tree-view package[1] and is styled by
      // 3rd-party themes. Add it to make this package's modals styleable the same as Atom's
      // tree-view.
      //
      // [1] https://github.com/atom/tree-view/blob/v0.200.0/lib/dialog.coffee#L7
      return _reactForAtom.React.createElement(
        'atom-panel',
        { 'class': 'modal overlay from-top' },
        _reactForAtom.React.createElement(
          'div',
          { className: 'tree-view-dialog', ref: 'dialog' },
          _reactForAtom.React.createElement(
            'label',
            { className: labelClassName },
            this.props.message
          ),
          _reactForAtom.React.createElement(_nuclideUiLibAtomInput.AtomInput, {
            initialValue: this.props.initialValue,
            ref: 'input'
          }),
          checkboxes
        )
      );
    }
  }, {
    key: '_handleAdditionalOptionChanged',
    value: function _handleAdditionalOptionChanged(name, isChecked) {
      var options = this.state.options;

      options[name] = isChecked;
      this.setState({ options: options });
    }
  }, {
    key: '_handleDocumentClick',
    value: function _handleDocumentClick(event) {
      var dialog = this.refs['dialog'];
      // If the click did not happen on the dialog or on any of its descendants,
      // the click was elsewhere on the document and should close the modal.
      if (event.target !== dialog && !dialog.contains(event.target)) {
        this._close();
      }
    }
  }, {
    key: '_confirm',
    value: function _confirm() {
      this.props.onConfirm(this.refs.input.getText(), this.state.options);
      this._close();
    }
  }, {
    key: '_close',
    value: function _close() {
      if (!this._isClosed) {
        this._isClosed = true;
        this.props.onClose();
      }
    }
  }]);

  return FileDialogComponent;
})(_reactForAtom.React.Component);

module.exports = FileDialogComponent;