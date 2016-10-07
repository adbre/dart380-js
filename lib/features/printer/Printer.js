'use strict';

var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

function Printer(eventBus) {
    this._eventBus = eventBus;
    this.isBusy = false;
    this._providers = [];
}

module.exports = Printer;

Printer.$inject = ['eventBus'];

Printer.prototype.registerProvider = function (provider) {
    if (!provider || !_.isFunction(provider.print)) {
        throw new Error('Printer provider must implement function .print(message)');
    }

    this._providers.push(provider);
};

Printer.prototype.print = function (message) {
    var self = this;

    if (self.isBusy) {
        return Promise.reject();
    }

    if (this._providers.length < 1) {
        return Promise.reject();
    }

    self._fire('printing', { message: message });
    self.isBusy = true;

    var promise = Promise.all(_.map(this._providers, function (provider) {
        return provider.print(message);
    }))
    .then(function () {
        self.isBusy = false;
        self._fire('printed', { message: message, success: true });
    })
    .catch(function (reason) {
        self.isBusy = false;
        self._fire('printed', { message: message, success: false, error: reason });
    });

    return promise;
};

Printer.prototype._fire = function (type, event) {
    this._eventBus.fire('printer.' + type, event);
};
