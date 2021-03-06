Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createProcessStream = createProcessStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideCommons2;

function _nuclideCommons() {
  return _nuclideCommons2 = require('../../nuclide-commons');
}

var _nuclideFeatureConfig2;

function _nuclideFeatureConfig() {
  return _nuclideFeatureConfig2 = _interopRequireDefault(require('../../nuclide-feature-config'));
}

var _rxjs2;

function _rxjs() {
  return _rxjs2 = _interopRequireDefault(require('rxjs'));
}

function createProcessStream() {
  return (0, (_nuclideCommons2 || _nuclideCommons()).observeProcess)(spawnAdbLogcat).map(function (event) {
    if (event.kind === 'error') {
      throw event.error;
    }
    if (event.kind === 'exit') {
      throw new Error('adb logcat exited unexpectedly');
    }
    return event;
  })

  // Only get the text from stdout.
  .filter(function (event) {
    return event.kind === 'stdout';
  }).map(function (event) {
    return event.data && event.data.replace(/\r?\n$/, '');
  })

  // Skip the single historical log. Adb requires us to have at least one (`-T`) but (for now at
  // least) we only want to show live logs. Also, since we're automatically retrying, displaying
  // it would mean users would get an inexplicable old entry.
  .skip(1);
}

function spawnAdbLogcat() {
  return (0, (_nuclideCommons2 || _nuclideCommons()).safeSpawn)((_nuclideFeatureConfig2 || _nuclideFeatureConfig()).default.get('nuclide-adb-logcat.pathToAdb'), ['logcat', '-v', 'long', '-T', '1']);
}