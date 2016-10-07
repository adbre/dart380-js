'use strict';

var _ = require('lodash');
var Promise = require('../../lib/util/Deferred');

function MockPrinter(printer) {
    printer.registerProvider(this);

    this.requests = [];
    this.callbacks = [];
}

module.exports = MockPrinter;

MockPrinter.module = {
    __init__: ['mockPrinter'],
    mockPrinter: ['type', MockPrinter]
};

MockPrinter.$inject = ['printer'];

MockPrinter.prototype.print = function (message) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var request = {
            message: message,
            complete: resolve,
            error: reject
        };

        self.requests.push(request);

        _.forEach(self.callbacks, function (callback) {
            callback(request);
        });
    });
};

MockPrinter.prototype.mostRecent = function () {
    return this.requests[this.requests.length - 1];
};
