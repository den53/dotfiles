

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var markers = require('../../constants/markers');
var wrapStatement = require('../../wrappers/simple/wrapStatement');

function printTryStatement(print, node) {
  var wrap = function wrap(x) {
    return wrapStatement(print, node, x);
  };

  var parts = [markers.hardBreak, 'try', markers.noBreak, markers.space, print(node.block)];

  if (node.handler) {
    var handler = node.handler;
    parts = parts.concat([markers.noBreak, markers.space, print(handler)]);
  }

  if (node.finalizer) {
    var finalizer = node.finalizer;
    parts = parts.concat([markers.noBreak, markers.space, 'finally', markers.noBreak, markers.space, print(finalizer)]);
  }

  return wrap(parts);
}

module.exports = printTryStatement;