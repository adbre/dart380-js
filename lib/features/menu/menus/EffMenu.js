'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var Ra180MenuBase = require('./../Ra180MenuBase');

function EffMenu(injector, eventBus, eff) {
    injector.invoke(Ra180MenuBase, this);

    this.init('EFF', 'EFF', [
        {
            prefix: 'EFF',
            options: eff.getOptions.bind(eff),
            selectedOption: eff.get.bind(eff),
            save: eff.set.bind(eff)
        }
    ]);
}

inherits(EffMenu, Ra180MenuBase);

module.exports = EffMenu;

EffMenu.$inject = ['injector', 'eventBus', 'eff'];
