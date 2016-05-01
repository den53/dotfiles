

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var flatten = require('../../utils/flatten');
var markers = require('../../constants/markers');

function printJSXClosingElement(print, node) {
  return flatten(['</', markers.noBreak, print(node.name), markers.noBreak, '>']);
}

module.exports = printJSXClosingElement;