'use strict';

var _ = require('lodash');

function Eff(eventBus, memory) {
    this._eventBus = eventBus;
    this._memory = memory;
}

module.exports = Eff;

Eff.$inject = ['eventBus', 'memory'];

Eff.prototype.hasHighVoltage = function (value) {
    if (!_.isUndefined(value)) {
        this._hasHighVoltage = !!value;
    }

    return !!this._hasHighVoltage;
};

Eff.prototype.getOptions = function () {
    var values = ['LÅG','NRM'];
    if (this.hasHighVoltage()) {
        values.push('HÖG')
    }
    return values;
};

Eff.prototype.get = function () {
    var options = this.getOptions();
    var value = this._memory.get('eff');
    if (!value || options.indexOf(value) < 0) {
        return options[0];
    }
    else {
        return value;
    }
};

Eff.prototype.set = function (value) {
    if (this.getOptions().indexOf(value) < 0) {
        return false;
    }

    this._memory.set('eff', value);
    this._eventBus.fire('eff.changed', { eff: this });
    return true;
};
