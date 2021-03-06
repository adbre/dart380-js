'use strict';

var inherits = require('inherits');

var MenuBase = require('./MenuBase');

function RootMenu(injector, eventBus) {
    injector.invoke(MenuBase, this);

    var self = this;

    self._menus = {};

    eventBus.on('off', function () {
        self.close();
    });

    eventBus.on('ready', function () {
        self.open();
    });

    eventBus.on('keyboard.keyPress', function (e) {
        if (!self.isOpen()) {
            return;
        }

        self.onKeyPress(e);
    });
}

inherits(RootMenu, MenuBase);

module.exports = RootMenu;

RootMenu.$inject = ['injector', 'eventBus'];

RootMenu.prototype.registerMenu = function (activationKey, menu, arg) {
    if (this._menus[activationKey]) {
        throw new Error('Key has already been allocated for another menu. Key: ' + activationKey);
    }

    this._menus[activationKey] = { menu: menu, arg: arg };
};

RootMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (!this.isOpenChild()) {
        var menu = this._menus[e.key];
        if (menu) {
            this.openChild(menu.menu, menu.arg || e.key);
            return true;
        }
    }

    return false;
};