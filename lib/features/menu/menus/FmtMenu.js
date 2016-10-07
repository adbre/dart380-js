'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');

function FmtMenu(injector, eventBus, menu, largeDisplay, smallDisplay, messages, editMessage) {
    injector.invoke(MenuBase, this);

    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._messages = messages;
    this._editMessage = editMessage;

    menu.registerMenu('FMT', this);
}

inherits(FmtMenu, MenuBase);

module.exports = FmtMenu;

FmtMenu.$inject = [
    'injector',
    'eventBus',
    'menu',
    'largeDisplay',
    'smallDisplay',
    'messages',
    'editMessage'
];

FmtMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'SLT') {
        this.close();
        return true;
    }
    else if (e.key == '⏎') {
        var current = this._messages.getFormat(this._value);
        if (current && current.value.length === 3) {
            this._editMessage.openNewMessage(current);
        }
        return true;
    }
    else if (e.key === '→') {
        var current = this._messages.getFormat(this._value);
        var next = current && this._messages.getFormat((current.value + '0').substr(0, 3));
        if (next) {
            this._value = next.value;
        }
        this.update();
        return true;
    }
    else if (e.key === '←') {
        var current = this._messages.getFormat(this._value);
        var next = current && current.parent && this._messages.getFormat(current.parent.value);
        if (next) {
            this._value = next.value;
        }
        this.update();
        return true;
    }
    else if (e.key === '↓') {
        var current = this._messages.getFormat(this._value);
        if (current) {
            var parentValue = (current.parent && current.parent.value) || '';
            var currentValue = current.value.substr(current.value.length - 1, 1);
            var nextValue = parentValue + Math.min(9, parseInt(currentValue) + 1).toString();
            var next = this._messages.getFormat(nextValue);
            if (next) {
                this._value = next.value;
            }
        }

        this.update();
        return true;
    }
    else if (e.key === '↑') {
        var current = this._messages.getFormat(this._value);
        if (current) {
            var parentValue = (current.parent && current.parent.value) || '';
            var currentValue = current.value.substr(current.value.length - 1, 1);
            var nextValue = parentValue + Math.max(0, parseInt(currentValue) - 1).toString();
            var next = this._messages.getFormat(nextValue);
            if (next) {
                this._value = next.value;
            }
        }

        this.update();
        return true;
    }
    else if (/^[0-9]$/.test(e.key)) {
        this._value = (this._value || '') + e.key;
        this.update();
        return true;
    }

    return false;
};

FmtMenu.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._value = null;

    this.update();
};

FmtMenu.prototype.close = function () {
    MenuBase.prototype.close.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

FmtMenu.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    var prefix = 'FORMAT:';
    var value = (this._value || '').toString();

    if (value.length > 3) {
        this._value = value = value.substring(0, 3);
    }

    var cursor = value.length + prefix.length;

    this._largeDisplay.set(sprintf('%s%s', prefix, value));
    this._largeDisplay.setCursor(cursor);

    var format = value && this._messages.getFormat(value);
    if (!value) {
        this._smallDisplay.set('ROT*NIVÅ');
    }
    else if (!format) {
        this._smallDisplay.set('SAKNAS');
    }
    else {
        this._smallDisplay.set(format.nameShort);
    }
};
