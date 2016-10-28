'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./MenuBase');

function get(value, obj) {
    if (_.isFunction(value)) {
        return value.call(obj);
    }
    else {
        return value;
    }
}

function Ra180MenuBase(injector, menu, eventBus, smallDisplay, largeDisplay) {
    injector.invoke(MenuBase, this);
    this.injector = injector;
    this._menu = menu;
    this._eventBus = eventBus;
    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;
}

inherits(Ra180MenuBase, MenuBase);

module.exports = Ra180MenuBase;

Ra180MenuBase.$inject = ['injector', 'menu', 'eventBus', 'smallDisplay', 'largeDisplay'];

Ra180MenuBase.prototype.init = function (key, name, menuItems) {
    this._menu.registerMenu(key, this);
    this._name = name;
    this._menuItemsFactory = menuItems;
};

Ra180MenuBase.prototype.startEdit = function() {
    if (this._isEditing) {
        return;
    }

    if (_.isFunction(this._currentMenuItem.onStartEdit)) {
        this._currentMenuItem.onStartEdit();
    }

    var menuItem = this._currentMenuItem;

    this._input = '';
    this._cursor = 0;
    this._maxLength = this._smallDisplay.size - get(menuItem.prefix, menuItem).length - 1;
    this._isEditing = true;
    this.update();
};

Ra180MenuBase.prototype.endEdit = function() {
    if (this._currentMenuItem.save(this._input) === false) {
        this._input = '';
        this._cursor = 0;
    }
    else {
        this._isEditing = false;
    }

    if (_.isFunction(this._currentMenuItem.onEndEdit)) {
        this._currentMenuItem.onEndEdit();
    }

    this.update();
};

Ra180MenuBase.prototype.cancelEdit = function() {
    this._isEditing = false;
    this.update();
};

Ra180MenuBase.prototype.writeEdit = function(char) {
    this._input = this._input.substring(0, this._cursor) + char + (this._input.substring(this._cursor + 1) || '');
    this._cursor = Math.min(this._cursor + 1, this._maxLength - 1);

    this.update();
};

Ra180MenuBase.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._menuItem = 0;
    this._menuItems = _.isFunction(this._menuItemsFactory) ? this._menuItemsFactory() : this._menuItemsFactory;
    this._currentMenuItem = this._menuItems[this._menuItem];

    this.update();
};

Ra180MenuBase.prototype.close = function () {
    MenuBase.prototype.close.apply(this, arguments);

    if (this._isEditing) {
        this.cancelEdit();
    }

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

Ra180MenuBase.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    var menuItem = this._currentMenuItem;

    if (this._menuItem === this._menuItems.length) {
        this._smallDisplay.set(sprintf('  (%s) ', this._name));
        return;
    } else if (this._menuItem > this._menuItems.length) {
        this._smallDisplay.clear();
        return;
    }

    var canEdit = get(menuItem.canEdit, menuItem);
    var canToggle = get(menuItem.canToggle, menuItem);
    var text = get(menuItem.text, menuItem);
    var prefix = get(menuItem.prefix, menuItem) || '';


    if (!canToggle && _.isArray(get(menuItem.options, menuItem))) {
        canToggle = true;
    }

    if (canToggle && !text) {
        text = get(menuItem.selectedOption, menuItem);
    }

    if (canToggle && _.isBoolean(text)) {
        if (prefix.length === 3) {
            text = text ? 'TILL' : 'FRÅN';
        }
        else {
            text = text ? 'PÅ' : 'AV';
        }
    }

    var separator = '';
    if (prefix) {
        separator = canEdit || canToggle ? ':' : '=';
    }

    if (canEdit) {
        if (this._isEditing) {
            text = this._input;

            var cursorIndex = prefix.length + separator.length + this._cursor;
            this._smallDisplay.setBlinking(cursorIndex);
            this._smallDisplay.setCursor(cursorIndex);
        }
        else {
            this._smallDisplay.setBlinking(false);
            this._smallDisplay.setCursor(false);
        }
    }
    else if (canToggle) {
        this._smallDisplay.setBlinking(prefix.length);
    }
    else {
        this._smallDisplay.setBlinking(false);
        this._smallDisplay.setCursor(false);
    }

    this._smallDisplay.set(sprintf('%s%s%s', prefix, separator, text));
};

Ra180MenuBase.prototype.nextMenuItem = function (step) {
    step = step || 1;
    var isEnabled;
    do {
        this._menuItem = Math.max(0, this._menuItem + step);
        this._currentMenuItem = this._menuItem < this._menuItems.length
            ? this._menuItems[this._menuItem]
            : null;

        if (this._currentMenuItem && this._currentMenuItem.enabled && this._currentMenuItem.enabled() === false) {
            isEnabled = false;
        }
        else {
            isEnabled = true;
        }
    } while (!isEnabled);

    if (this._menuItem > this._menuItems.length) {
        this.close();
    } else {
        this.update();
    }
};

Ra180MenuBase.prototype.previousMenuItem = function () {
    this.nextMenuItem(-1);
};

Ra180MenuBase.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    var menu = this._currentMenuItem;
    var options = menu && get(menu.options, menu);

    if (e.key === '⏎') {
        if (this._isEditing) {
            this.endEdit();
        }
        else {
            this.nextMenuItem();
        }

        return true;
    }
    else if (e.key === 'SLT') {
        if (this._isEditing) {
            this.cancelEdit();
        }
        else {
            this.close();
        }
        return true;
    }
    else if (e.key === 'ÄND' && menu && get(menu.canEdit, menu)) {
        if (this._isEditing) {
            this._input = this._input.substr(0, this._cursor - 1);
            this._cursor = Math.max(0, this._cursor - 1);
            this.update();
        } else {
            this.startEdit();
        }
        return true;
    }
    else if (e.key === 'ÄND' && menu && _.isArray(options)) {
        var selectedIndex = _.indexOf(options, get(menu.selectedOption, menu));
        selectedIndex++;
        if (selectedIndex >= options.length) {
            selectedIndex = 0;
        }
        this.startEdit();
        this._input = options[selectedIndex];
        this.endEdit();
        return true;
    }
    else if (e.key === 'ÄND' && menu && !!get(menu.canToggle, menu) && _.isFunction(menu.toggle)) {
        menu.toggle();
        this.update();
        return true;
    }
    else if (this._isEditing && this.isAllowedInput(e.key)) {
        this.writeEdit(e.key);
        return true;
    }
    else if (this._isEditing && e.key === 'DEL') {
        var before = this._input.substr(0, this._cursor);
        var after = this._input.substr(this._cursor + 1);
        this._input = before + after;
        this.update();
        return true;
    }

    return false;
};

Ra180MenuBase.prototype.isAllowedInput = function (key) {
    if (this._currentMenuItem && _.isFunction(this._currentMenuItem.isAllowedInput)) {
        return this._currentMenuItem.isAllowedInput(key, this._input);
    }

    return /^[0-9]$/.test(key);
};
