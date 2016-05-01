Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getRuntimeInformation = getRuntimeInformation;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _clientInfo = require('./clientInfo');

var _systemInfo = require('./systemInfo');

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

var cachedInformation = null;

function getCacheableRuntimeInformation() {
  if (cachedInformation !== null) {
    return cachedInformation;
  }

  cachedInformation = {
    sessionId: '',
    user: _environment2['default'].USER,
    osType: (0, _systemInfo.getOsType)(),
    timestamp: 0,
    isClient: (0, _clientInfo.isRunningInClient)(),
    isDevelopment: (0, _clientInfo.isDevelopment)(),
    atomVersion: (0, _clientInfo.isRunningInClient)() ? (0, _clientInfo.getAtomVersion)() : '',
    nuclideVersion: (0, _clientInfo.getNuclideVersion)(),
    installerPackageVersion: 0,
    uptime: 0,
    // TODO (chenshen) fill following information.
    serverVersion: 0
  };

  return cachedInformation;
}

function getRuntimeInformation() {
  var runtimeInformation = _extends({}, getCacheableRuntimeInformation(), {
    sessionId: _session2['default'].id,
    timestamp: Date.now(),
    uptime: Math.floor(process.uptime() * 1000)
  });
  return runtimeInformation;
}