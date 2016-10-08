'use strict';

var _ = require('lodash');
var di = require('didi');

function bootstrap(bootstrapModules) {
    var modules = [],
        components = [];

    function hasModule(m) {
        return modules.indexOf(m) >= 0;
    }

    function addModule(m) {
        modules.push(m);
    }

    function visit(m) {
        if (hasModule(m)) {
            return;
        }

        (m.__depends__ || []).forEach(visit);

        if (hasModule(m)) {
            return;
        }

        addModule(m);

        (m.__init__ || []).forEach(function (c) {
            components.push(c);
        });
    }

    bootstrapModules.forEach(visit);

    var injector = new di.Injector(modules);

    components.forEach(function (c) {
        try {
            // eagerly resolve component (fn or string)
            injector[typeof c === 'string' ? 'get' : 'invoke'](c);
        } catch (e) {
            console.error('Failed to instantiate component');
            console.error(e.stack);
            throw e;
        }
    });

    return injector;
}

function createInjector(options) {
    options = options || {};

    var configModule = {
        'config': ['value', options]
    };

    var coreModule = require('./core');

    var modules = [
        configModule,
        require('./core'),
        require('./features/mod'),
        require('./features/displays'),
        require('./features/keyboard'),
        require('./features/self-test'),
        require('./features/menu'),
        require('./features/time'),
        require('./features/eff'),
        require('./features/dda'),
        require('./features/kda'),
        require('./features/brightness'),
        require('./features/volume'),
        require('./features/channel'),
        require('./features/key-checksum'),
        require('./features/communication'),
        require('./features/opm'),
        require('./features/remote-control'),
        require('./features/memory'),
        require('./features/messages'),
        require('./features/printer'),
        require('./features/sleep'),
    ].concat(options.modules || []);

    return bootstrap(modules);
}

function Dart380(options, injector) {

    this.injector = injector = injector || createInjector(options);

    this.get = injector.get;
    this.invoke = injector.invoke;

    var eventBus = injector.get('eventBus');
    eventBus.fire('dart380.init');

    this.SPECIAL_KEYS = this.get('keyboard').keys;
}

module.exports = Dart380;

Dart380.prototype.destroy = function () {
    this.get('eventBus').fire('dart380.destroy');
};
