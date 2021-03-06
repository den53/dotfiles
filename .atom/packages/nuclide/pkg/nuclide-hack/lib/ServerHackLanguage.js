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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom2;

function _atom() {
  return _atom2 = require('atom');
}

var _nuclideLogging2;

function _nuclideLogging() {
  return _nuclideLogging2 = require('../../nuclide-logging');
}

var _TypedRegions2;

function _TypedRegions() {
  return _TypedRegions2 = require('./TypedRegions');
}

var _nuclideHackCommon2;

function _nuclideHackCommon() {
  return _nuclideHackCommon2 = require('../../nuclide-hack-common');
}

/**
 * Serves language requests from HackService.
 * Note that all line/column values are 1 based.
 */

var ServerHackLanguage = (function () {

  /**
   * `basePath` should be the directory where the .hhconfig file is located.
   */

  function ServerHackLanguage(hackService, hhAvailable, basePath) {
    _classCallCheck(this, ServerHackLanguage);

    this._hackService = hackService;
    this._hhAvailable = hhAvailable;
    this._basePath = basePath;
  }

  _createClass(ServerHackLanguage, [{
    key: 'dispose',
    value: function dispose() {}
  }, {
    key: 'getCompletions',
    value: _asyncToGenerator(function* (filePath, contents, offset) {
      var markedContents = markFileForCompletion(contents, offset);
      var completions = [];
      var completionsResult = yield this._hackService.getCompletions(filePath, markedContents);
      if (completionsResult) {
        completions = completionsResult.completions;
      }
      return processCompletions(completions);
    })
  }, {
    key: 'formatSource',
    value: _asyncToGenerator(function* (contents, startPosition, endPosition) {
      var path = this._basePath;
      if (path == null) {
        throw new Error('No Hack provider for this file.');
      }
      var response = yield this._hackService.formatSource(path, contents, startPosition, endPosition);
      if (response == null) {
        throw new Error('Error formatting hack source.');
      } else if (response.error_message !== '') {
        throw new Error('Error formatting hack source: ' + response.error_message);
      }
      return response.result;
    })
  }, {
    key: 'highlightSource',
    value: _asyncToGenerator(function* (filePath, contents, line, col) {
      var response = yield this._hackService.getSourceHighlights(filePath, contents, line, col);
      if (response == null) {
        return [];
      }
      return response.positions.map(hackRangeToAtomRange);
    })
  }, {
    key: 'getDiagnostics',
    value: _asyncToGenerator(function* (filePath, contents) {
      var diagnosticResult = null;
      try {
        diagnosticResult = yield this._hackService.getDiagnostics(filePath, contents);
      } catch (err) {
        (0, (_nuclideLogging2 || _nuclideLogging()).getLogger)().error(err);
        return [];
      }
      if (!diagnosticResult) {
        (0, (_nuclideLogging2 || _nuclideLogging()).getLogger)().error('hh_client could not be reached');
        return [];
      }
      var hackDiagnostics = diagnosticResult;
      return hackDiagnostics.messages;
    })
  }, {
    key: 'getTypeCoverage',
    value: _asyncToGenerator(function* (filePath) {
      var regions = yield this._hackService.getTypedRegions(filePath);
      return (0, (_TypedRegions2 || _TypedRegions()).convertTypedRegionsToCoverageRegions)(regions);
    })
  }, {
    key: 'getOutline',
    value: function getOutline(filePath, contents) {
      return this._hackService.getOutline(filePath, contents);
    }
  }, {
    key: 'getDefinition',
    value: _asyncToGenerator(function* (filePath, contents, lineNumber, column, lineText) {
      var definitionResult = yield this._hackService.getIdentifierDefinition(filePath, contents, lineNumber, column);
      var identifierResult = processDefinitionsForXhp(definitionResult, column, lineText);
      return identifierResult.length === 1 ? identifierResult : [];
    })
  }, {
    key: 'getIdeDefinition',
    value: _asyncToGenerator(function* (filePath, contents, lineNumber, column) {
      var definition = yield this._hackService.getDefinition(filePath, contents, lineNumber, column);
      if (definition == null || definition.definition_pos == null) {
        return null;
      }
      return {
        name: definition.name,
        path: definition.definition_pos.filename,
        line: definition.definition_pos.line,
        column: definition.definition_pos.char_start,
        queryRange: hackRangeToAtomRange(definition.pos)
      };
    })
  }, {
    key: 'getType',
    value: _asyncToGenerator(function* (filePath, contents, expression, lineNumber, column) {
      if (!expression.startsWith('$')) {
        return null;
      }
      var result = yield this._hackService.getTypeAtPos(filePath, contents, lineNumber, column);
      return result == null ? null : result.type;
    })
  }, {
    key: 'findReferences',
    value: _asyncToGenerator(function* (filePath, contents, line, column) {
      var getMethodNameResult = yield this._hackService.getMethodName(filePath, contents, line + 1, column + 1);
      if (getMethodNameResult == null) {
        return null;
      }
      var symbolName = getMethodNameResult.name;
      var symbolType = getSymbolType(getMethodNameResult.result_type);

      if (!SYMBOL_TYPES_WITH_REFERENCES.has(symbolType)) {
        return null;
      }

      var referencesResult = yield this._hackService.getReferences(filePath, symbolName, symbolType);
      if (!referencesResult) {
        return null;
      }
      var hackRoot = referencesResult.hackRoot;
      var references = referencesResult.references;

      return { baseUri: hackRoot, symbolName: symbolName, references: references };
    })
  }, {
    key: 'getBasePath',
    value: function getBasePath() {
      return this._basePath;
    }
  }, {
    key: 'isHackAvailable',
    value: function isHackAvailable() {
      return this._hhAvailable;
    }
  }]);

  return ServerHackLanguage;
})();

exports.ServerHackLanguage = ServerHackLanguage;

function hackRangeToAtomRange(position) {
  return new (_atom2 || _atom()).Range([position.line - 1, position.char_start - 1], [position.line - 1, position.char_end]);
}

// The xhp char regex include : and - to match xhp tags like <ui:button-group>.
var xhpCharRegex = /[\w:-]/;

var stringToSymbolType = {
  'class': (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.CLASS,
  'function': (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.FUNCTION,
  'method': (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.METHOD,
  'local': (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.LOCAL
};

// Symbol types we can get references for.
var SYMBOL_TYPES_WITH_REFERENCES = new Set([(_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.CLASS, (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.FUNCTION, (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.METHOD]);

function getSymbolType(input) {
  var symbolType = stringToSymbolType[input];
  if (typeof symbolType === 'undefined') {
    symbolType = (_nuclideHackCommon2 || _nuclideHackCommon()).SymbolType.METHOD;
  }
  return symbolType;
}

function processCompletions(completionsResponse) {
  return completionsResponse.map(function (completion) {
    var name = completion.name;
    var functionDetails = completion.func_details;
    var type = completion.type;

    if (type && type.indexOf('(') === 0 && type.lastIndexOf(')') === type.length - 1) {
      type = type.substring(1, type.length - 1);
    }
    var matchSnippet = name;
    if (functionDetails) {
      var params = functionDetails.params;

      // Construct the snippet: e.g. myFunction(${1:$arg1}, ${2:$arg2});
      var paramsString = params.map(function (param, index) {
        return '${' + (index + 1) + ':' + param.name + '}';
      }).join(', ');
      matchSnippet = name + '(' + paramsString + ')';
    }
    return {
      matchSnippet: matchSnippet,
      matchText: name,
      matchType: type
    };
  });
}

// Calculate the offset of the cursor from the beginning of the file.
// Then insert AUTO332 in at this offset. (Hack uses this as a marker.)
function markFileForCompletion(contents, offset) {
  return contents.substring(0, offset) + 'AUTO332' + contents.substring(offset, contents.length);
}

function processDefinitionsForXhp(definitionResult, column, lineText) {
  if (!definitionResult) {
    return [];
  }
  var definitions = definitionResult.definitions;

  return definitions.map(function (definition) {
    var name = definition.name;

    if (name.startsWith(':')) {
      // XHP class name, usages omit the leading ':'.
      name = name.substring(1);
    }
    var definitionIndex = lineText.indexOf(name);
    if (definitionIndex === -1 || definitionIndex >= column || !xhpCharRegex.test(lineText.substring(definitionIndex, column))) {
      return _extends({}, definition);
    } else {
      return _extends({}, definition, {
        searchStartColumn: definitionIndex,
        searchEndColumn: definitionIndex + definition.name.length
      });
    }
  });
}