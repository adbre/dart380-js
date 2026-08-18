'use strict';

var unique = require('lodash').uniq,
    isFunction = require('lodash').isFunction,
    merge = require('lodash').merge,
    forEach = require('lodash').forEach;

var Dart380 = require('../../lib/Dart380');

var OPTIONS, DART380_JS;

function bootstrapDart380(options, locals) {

  afterEach(cleanup);

  return function() {

    var _options = options,
        _locals = locals;

    if (!_locals && isFunction(_options)) {
      _locals = _options;
      _options = null;
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    _options = merge(OPTIONS, _options);

    var mockModule = {};

    forEach(_locals, function(v, k) {
      mockModule[k] = ['value', v];
    });

    _options.modules = unique([].concat(_options.modules || [], [ mockModule ]));

    // remove previous instance
    cleanup();

    DART380_JS = new Dart380(_options);

    jasmine.clock().install().mockDate(new Date());
  };
}

function inject(fn) {
  return function() {

    if (!DART380_JS) {
      throw new Error('no bootstraped dart380, ensure you created it via #bootstrapDart380');
    }

    return DART380_JS.invoke(fn);
  };
}

function cleanup() {
  jasmine.clock().uninstall();

  if (!DART380_JS) {
    return;
  }

  DART380_JS.destroy();
}

module.exports.bootstrapDart380 = globalThis.bootstrapDart380 = bootstrapDart380;
module.exports.inject = globalThis.inject = inject;
