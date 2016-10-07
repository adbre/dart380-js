'use strict';

var _ = require('lodash');

var DATA_KEY = 'memory.data';

function Memory(eventBus) {
    this._eventBus = eventBus;

    this._storage = (function () {
        var data = {};
        return {
            setItem: function (key, value) {
                data[key] = value;
            },

            getItem: function (key) {
                return data[key];
            },

            removeItem: function (key) {
                delete data[key];
            }
        };
    })();

    this._data = null;
}

module.exports = Memory;

Memory.$inject = ['eventBus'];

Memory.prototype.clear = function () {
    this._storage.removeItem(DATA_KEY);
    this._eventBus.fire('memory.cleared', {});
};

Memory.prototype.isEmpty = function () {
    return !this._storage.getItem(DATA_KEY);
};

Memory.prototype.get = function (key) {
    var data = JSON.parse(this._storage.getItem(DATA_KEY) || '{}');
    if (!data[key]) {
        return undefined;
    }

    return JSON.parse(data[key]);
};

Memory.prototype.set = function (key, value) {
    var data = JSON.parse(this._storage.getItem(DATA_KEY) || '{}');
    data[key] = JSON.stringify(value);
    this._storage.setItem(DATA_KEY, JSON.stringify(data));
    this._eventBus.fire('memory.changed', { key: key, value: value });
};