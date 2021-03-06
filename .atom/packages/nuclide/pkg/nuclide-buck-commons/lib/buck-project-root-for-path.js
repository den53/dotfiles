

/**
 * @return Promise that resolves to buck project or null if the
 *     specified filePath is not part of a Buck project.
 */

var buckProjectRootForPath = _asyncToGenerator(function* (filePath) {
  var service = (0, (_nuclideClient2 || _nuclideClient()).getServiceByNuclideUri)('BuckUtils', filePath);
  (0, (_assert2 || _assert()).default)(service);
  var buckUtils = new service.BuckUtils();
  var directory = yield buckUtils.getBuckProjectRoot(filePath);

  if (!directory) {
    return null;
  }

  var buckProject = buckProjectForBuckProjectDirectory[directory];
  if (buckProject) {
    return buckProject;
  }

  directory = (0, (_nuclideRemoteUri2 || _nuclideRemoteUri()).getPath)(directory);

  var buckService = (0, (_nuclideClient2 || _nuclideClient()).getServiceByNuclideUri)('BuckProject', filePath);
  if (buckService) {
    buckProject = new buckService.BuckProject({ rootPath: directory });
    buckProjectForBuckProjectDirectory[directory] = buckProject;
  }
  return buckProject;
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert2;

function _assert() {
  return _assert2 = _interopRequireDefault(require('assert'));
}

var _nuclideRemoteUri2;

function _nuclideRemoteUri() {
  return _nuclideRemoteUri2 = require('../../nuclide-remote-uri');
}

var _nuclideClient2;

function _nuclideClient() {
  return _nuclideClient2 = require('../../nuclide-client');
}

var buckProjectForBuckProjectDirectory = {};

module.exports = buckProjectRootForPath;