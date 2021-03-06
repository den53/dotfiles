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

// This extra module enables adding spies during testing.
var track = undefined;
exports.track = track;
try {
  exports.track = exports.track = track = require('../fb/analytics').track;
} catch (e) {
  exports.track = exports.track = track = require('./analytics').track;
}