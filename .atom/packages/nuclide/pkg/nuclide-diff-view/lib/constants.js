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

var _Object$freeze, _Object$freeze2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _nuclideHgRepositoryBase = require('../../nuclide-hg-repository-base');

var HgStatusCodeNumber = _nuclideHgRepositoryBase.hgConstants.StatusCodeNumber;
var GK_DIFF_VIEW_PUBLISH = 'nuclide_diff_view_publish';
exports.GK_DIFF_VIEW_PUBLISH = GK_DIFF_VIEW_PUBLISH;
var TOOLBAR_VISIBLE_SETTING = 'nuclide-diff-view.toolbarVisible';

exports.TOOLBAR_VISIBLE_SETTING = TOOLBAR_VISIBLE_SETTING;
var FileChangeStatus = Object.freeze({
  ADDED: 1,
  MODIFIED: 2,
  MISSING: 3,
  REMOVED: 4,
  UNTRACKED: 5
});

exports.FileChangeStatus = FileChangeStatus;
FileChangeStatus;

var DiffMode = Object.freeze({
  BROWSE_MODE: '1. Browse',
  COMMIT_MODE: '2. Commit',
  PUBLISH_MODE: '3. Publish'
});

exports.DiffMode = DiffMode;
// This is to work around flow's missing support of enums.
DiffMode;

var DiffOption = Object.freeze({
  DIRTY: 'Dirty',
  LAST_COMMIT: 'Last Commit',
  COMPARE_COMMIT: 'Compare Commit'
});

exports.DiffOption = DiffOption;
// This is to work around flow's missing support of enums.
DiffOption;

var CommitMode = Object.freeze({
  COMMIT: 'Commit',
  AMEND: 'Amend'
});

exports.CommitMode = CommitMode;
// This is to work around flow's missing support of enums.
CommitMode;

var CommitModeState = Object.freeze({
  READY: 'Ready',
  LOADING_COMMIT_MESSAGE: 'Loading Commit Message',
  AWAITING_COMMIT: 'Awaiting Commit'
});

exports.CommitModeState = CommitModeState;
// This is to work around flow's missing support of enums.
CommitModeState;

var PublishMode = Object.freeze({
  CREATE: 'Create',
  UPDATE: 'Update'
});

exports.PublishMode = PublishMode;
// This is to work around flow's missing support of enums.
PublishMode;

var PublishModeState = Object.freeze({
  READY: 'Ready',
  LOADING_PUBLISH_MESSAGE: 'Loading Publish Message',
  AWAITING_PUBLISH: 'Awaiting Publish',
  PUBLISH_ERROR: 'Publish Error'
});

exports.PublishModeState = PublishModeState;
// This is to work around flow's missing support of enums.
PublishModeState;

var HgStatusToFileChangeStatus = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze, HgStatusCodeNumber.ADDED, FileChangeStatus.ADDED), _defineProperty(_Object$freeze, HgStatusCodeNumber.MODIFIED, FileChangeStatus.MODIFIED), _defineProperty(_Object$freeze, HgStatusCodeNumber.MISSING, FileChangeStatus.MISSING), _defineProperty(_Object$freeze, HgStatusCodeNumber.REMOVED, FileChangeStatus.REMOVED), _defineProperty(_Object$freeze, HgStatusCodeNumber.UNTRACKED, FileChangeStatus.UNTRACKED), _Object$freeze));

exports.HgStatusToFileChangeStatus = HgStatusToFileChangeStatus;
var FileChangeStatusToPrefix = Object.freeze((_Object$freeze2 = {}, _defineProperty(_Object$freeze2, FileChangeStatus.ADDED, '[A] '), _defineProperty(_Object$freeze2, FileChangeStatus.MODIFIED, '[M] '), _defineProperty(_Object$freeze2, FileChangeStatus.MISSING, '[!] '), _defineProperty(_Object$freeze2, FileChangeStatus.REMOVED, '[D] '), _defineProperty(_Object$freeze2, FileChangeStatus.UNTRACKED, '[?] '), _Object$freeze2));
exports.FileChangeStatusToPrefix = FileChangeStatusToPrefix;