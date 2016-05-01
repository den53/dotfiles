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

var _reactForAtom = require('react-for-atom');

/** A Block. */
var Block = function Block(props) {
  return _reactForAtom.React.createElement(
    'div',
    { className: 'block' },
    props.children
  );
};
exports.Block = Block;