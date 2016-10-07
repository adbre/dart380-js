'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');

function ShowMessagesMenu(
    injector,
    eventBus,
    menu,
    largeDisplay,
    smallDisplay,
    messages,
    kda,
    communication,
    editMessage
    )
{
    injector.invoke(MenuBase, this);

    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._messages = messages;
    this._kda = kda;
    this._communication = communication;
    this._editMessage = editMessage;

    menu.registerMenu('ISK', this);
    menu.registerMenu('MOT', this);
    menu.registerMenu('AVS', this);
    menu.registerMenu('EKV', this);
    menu.registerMenu('F1', this);
    menu.registerMenu('F2', this);
    menu.registerMenu('F3', this);
    menu.registerMenu('F4', this);
}

inherits(ShowMessagesMenu, MenuBase);

module.exports = ShowMessagesMenu;

ShowMessagesMenu.$inject = [
    'injector',
    'eventBus',
    'menu',
    'largeDisplay',
    'smallDisplay',
    'messages',
    'kda',
    'communication',
    'editMessage'
];

ShowMessagesMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'SLT') {
        this.close();
        return true;
    }
    else if (!this._hasSent) {
        if (e.key == 'SND' && this._currentMessage) {
            var self = this;
            var message = self._currentMessage;
            var hasActiveKey = !!this._kda.getActiveKey();
            self._largeDisplay.set(hasActiveKey ? 'SÄNDER' : 'NÖDSÄNDER', { center: true });
            self._communication.send(message)
                .then(function () {
                    if (self._currentMessage !== message) {
                        return;
                    }
                    self._hasSent = true;
                    self._largeDisplay.set(hasActiveKey ? 'SÄNT' : 'NÖDSÄNT', { center: true });
                }, function (reason) {
                    if (self._currentMessage !== message) {
                        return;
                    }
                    self._hasSent = true;
                    self._largeDisplay.set(self._getErrorMessage(reason), { center: true });
                });
            return true;
        }
        else if (e.key === '△') {
            this._previousMessage();
            return true;
        }
        else if (e.key === '▽' || e.key == '⏎') {
            this._nextMessage();
            return true;
        }
        else if (e.key === '→') {

        }
        else if (e.key === '←') {

        }
        else if (e.key === '↓') {
            this._nextLine();
            return true;
        }
        else if (e.key === '↑') {
            this._previousLine();
            return true;
        }
        else if (e.key === 'KVI' && this._currentMessage) {
            this._editMessage.openNewReceiptMessage(this._currentMessage);
            return true;
        }
        else if (e.key === 'REP' && this._currentMessage) {
            this._editMessage.openNewRepeatMessage(this._currentMessage);
            return true;
        }
    }

    return false;
};

ShowMessagesMenu.prototype.close = function () {
    MenuBase.prototype.close.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

ShowMessagesMenu.prototype.open = function (registry) {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._hasSent = false;
    this._index = -1;
    this._row = 0;
    this._registry = registry;
    this._nextMessage();
};

ShowMessagesMenu.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    if (!this._currentMessage) {
        this._largeDisplay.set(this._getEndOfRegistryString(), { center: true });
        this._smallDisplay.clear();
        return;
    }

    this._largeDisplay.set(this._currentMessage.toString(this._row));
    this._smallDisplay.set(this._currentMessage.format.nameShort);
};

ShowMessagesMenu.prototype._nextMessage = function (step) {
    if (_.isUndefined(step)) {
        step = 1;
    }

    var messages = this._messages.get(this._registry);
    this._index = Math.max(0, Math.min(messages.length, this._index + step));
    this._currentMessage = messages[this._index];
    this._row = 2;
    this.update();
};

ShowMessagesMenu.prototype._previousMessage = function () {
    this._nextMessage(-1);
};

ShowMessagesMenu.prototype._nextLine = function (step) {
    if (_.isUndefined(step)) {
        step = 1;
    }

    if (!this._currentMessage) {
        this._row = -1;
    }

    this._row = Math.max(0, Math.min(this._currentMessage.rowCount(), this._row + step));
    this.update();
};

ShowMessagesMenu.prototype._previousLine = function () {
    this._nextLine(-1);
};

ShowMessagesMenu.prototype._getEndOfRegistryString = function () {
    switch (this._registry) {
        case 'MOT': return '(MOTTAGNA)';
        case 'EKV': return '(MOTT EJ KVITT)';
        case 'ISK': return '(INSKRIVNA)';
        case 'AVS': return '(SÄNDA)';
        case 'F1':
        case 'F2':
        case 'F3':
        case 'F4': return 'EJ LAGRAT';
        default:
            throw new Error('Registry unkown: ' + this._registry);
    }
};

ShowMessagesMenu.prototype._getErrorMessage = function (reason) {
    switch (reason) {
        case this._communication.Error.Mod: return 'FEL MOD';
        case this._communication.Error.Header: return 'FEL HUVUD';
        case this._communication.Error.Busy: return 'UPPTAGET';
        case this._communication.Error.Memory: return 'MFULLT EJ LAGRAT';
        default:
            return (reason || 'OKÄNT FEL');
    }
};