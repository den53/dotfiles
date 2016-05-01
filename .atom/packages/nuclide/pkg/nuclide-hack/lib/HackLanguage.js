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

exports.getCachedHackLanguageForUri = getCachedHackLanguageForUri;

var getHackLanguageForUri = _asyncToGenerator(function* (uri) {
  if (uri == null || uri.length === 0) {
    return null;
  }
  var key = getKeyOfUri(uri);
  if (key == null) {
    return null;
  }
  return yield createHackLanguageIfNotExisting(key, uri);
});

exports.getHackLanguageForUri = getHackLanguageForUri;

var createHackLanguageIfNotExisting = _asyncToGenerator(function* (key, fileUri) {
  if (!uriToHackLanguage.has(key)) {
    var hackEnvironment = yield (0, _utils.getHackEnvironmentDetails)(fileUri);

    // If multiple calls were done asynchronously, then return the single-created HackLanguage.
    if (!uriToHackLanguage.has(key)) {
      uriToHackLanguage.set(key, createHackLanguage(hackEnvironment.hackService, hackEnvironment.isAvailable, hackEnvironment.hackRoot));
    }
  }
  return uriToHackLanguage.get(key);
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _ServerHackLanguage = require('./ServerHackLanguage');

var _nuclideRemoteConnection = require('../../nuclide-remote-connection');

var _nuclideRemoteUri = require('../../nuclide-remote-uri');

var _utils = require('./utils');

/**
 * The HackLanguage is the controller that servers language requests by trying to get worker results
 * and/or results from HackService (which would be executing hh_client on a supporting server)
 * and combining and/or selecting the results to give back to the requester.
 */

/**
 * This is responsible for managing (creating/disposing) multiple HackLanguage instances,
 * creating the designated HackService instances with the NuclideClient it needs per remote project.
 * Also, it deelegates the language feature request to the correct HackLanguage instance.
 */
var uriToHackLanguage = new Map();

// dummy key into uriToHackLanguage for local projects.
// Any non-remote NuclideUri will do.
// TODO: I suspect we should key the local service off of the presence of a .hhconfig file
// rather than having a single HackLanguage for all local requests. Regardless, we haven't tested
// local hack services so save that for another day.
var LOCAL_URI_KEY = 'local-hack-key';

function createHackLanguage(hackService, hhAvailable, basePath) {
  return new _ServerHackLanguage.ServerHackLanguage(hackService, hhAvailable, basePath);
}

// Returns null if we can't get the key at this time because the RemoteConnection is initializing.
// This can happen on startup when reloading remote files.
function getKeyOfUri(uri) {
  var remoteConnection = _nuclideRemoteConnection.RemoteConnection.getForUri(uri);
  return remoteConnection == null ? (0, _nuclideRemoteUri.isRemote)(uri) ? null : LOCAL_URI_KEY : remoteConnection.getUriForInitialWorkingDirectory();
}

function getCachedHackLanguageForUri(uri) {
  var key = getKeyOfUri(uri);
  return key == null ? null : uriToHackLanguage.get(uri);
}

// Range in the input where the symbol reference occurs.