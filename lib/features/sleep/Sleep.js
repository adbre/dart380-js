'use strict';

var inherits = require('inherits'),
    _ = require('lodash');

var MenuBase = require('../menu/MenuBase');

function Sleep(eventBus, menu, largeDisplay, smallDisplay) {

    this._eventBus = eventBus;
    this._menu = menu;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;

    this._timeout = null;

    eventBus.on('keyboard.keyPress', function () {
        if (menu.isOpen()) {
            this._start();
        }
        else {
            this._stop();
        }
    }.bind(this));
}

module.exports = Sleep;

Sleep.$inject = ['eventBus', 'menu', 'largeDisplay', 'smallDisplay'];

inherits(Sleep, MenuBase);

Sleep.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    this.close();
    return true;
};

Sleep.prototype.update = function (e) {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

Sleep.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this.update();
};

Sleep.prototype.close = function () {
    var parent = this._parent;
    MenuBase.prototype.close.apply(this, arguments);

    if (parent && _.isFunction(parent.update)) {
        parent.update();
    }
};

Sleep.prototype._start = function () {
    this._stop();

    var turnOfFDisplayTimeout,
        exitFunctionTimeout;

    if (this._isEditing()) {
        turnOfFDisplayTimeout = 60;
        exitFunctionTimeout = 5;
    }
    else {
        turnOfFDisplayTimeout = 30;
        exitFunctionTimeout = this._isMultiLineFunction() ? 5 : 0;
    }

    this._timeout = window.setTimeout(function () {
        this._turnOffDisplay();

        if (exitFunctionTimeout > 0) {
            this._timeout = window.setTimeout(function () {
                this._exitFunction();
            }.bind(this), exitFunctionTimeout * 1000);
        }
        else {
            this._exitFunction();
        }
    }.bind(this), turnOfFDisplayTimeout * 1000);
};

Sleep.prototype._stop = function () {
    window.clearTimeout(this._timeout);
};

Sleep.prototype._turnOffDisplay = function () {
    if (!this._menu.isOpenChild()) {
        return;
    }

    this._getTopMostMenu().openChild(this);
};

Sleep.prototype._exitFunction = function () {
    this._menu._child.close();
};

Sleep.prototype._getChild = function (menu) {
    if (menu._child) {
        return this._getChild(menu._child);
    } else {
        return menu;
    }
};

Sleep.prototype._getTopMostMenu = function () {
    return this._getChild(this._menu);
};

Sleep.prototype._isEditing = function () {
    return !!this._getTopMostMenu()._isEditing;
};

Sleep.prototype._isMultiLineFunction = function () {
    return !!this._getTopMostMenu()._isMultiLineFunction;
};