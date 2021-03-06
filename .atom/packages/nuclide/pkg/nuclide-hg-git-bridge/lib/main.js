

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

module.exports = Object.defineProperties({}, {
  repositoryContainsPath: {
    get: function get() {
      return require('./repositoryContainsPath');
    },
    configurable: true,
    enumerable: true
  },
  repositoryForPath: {
    get: function get() {
      return require('./repositoryForPath');
    },
    configurable: true,
    enumerable: true
  }
});