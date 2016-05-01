

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var markers = require('../../constants/markers');
var wrapStatement = require('../../wrappers/simple/wrapStatement');

function printThrowStatement(print, node) {
  var wrap = function wrap(x) {
    return wrapStatement(print, node, x);
  };
  return wrap(['throw', print(node.argument), markers.noBreak, ';']);
}

module.exports = printThrowStatement;