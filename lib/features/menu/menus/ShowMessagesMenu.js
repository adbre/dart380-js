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
    editMessage,
    printer
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
    this._printer = printer;

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
    'editMessage',
    'printer'
];

ShowMessagesMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    var handled = false;

    if (e.key === 'SLT') {
        this.close();
        handled = true;
    }
    else if (!this._isWaitingForAnyKeyToContinue) {
        if (e.key === '△') {
            this._previousMessage();
            handled = true;
        }
        else if (e.key === '▽' || e.key == '⏎') {
            this._nextMessage();
            handled = true;
        }
        else if (e.key === '→') {

        }
        else if (e.key === '←') {

        }
        else if (e.key === '↓') {
            this._nextLine();
            handled = true;
        }
        else if (e.key === '↑') {
            this._previousLine();
            handled = true;
        }
        else if (this._currentMessage) {
            if (e.key == 'SND') {
                var self = this;
                var message = self._currentMessage;
                var hasActiveKey = !!this._kda.getActiveKey();
                self._largeDisplay.set(hasActiveKey ? 'SÄNDER' : 'NÖDSÄNDER', { center: true });
                self._communication.send(message)
                    .then(function () {
                        if (self._currentMessage !== message) {
                            return;
                        }
                        self._isWaitingForAnyKeyToContinue = true;
                        self._largeDisplay.set(hasActiveKey ? 'SÄNT' : 'NÖDSÄNT', { center: true });
                    })
                    .catch(function (reason) {
                        if (self._currentMessage !== message) {
                            return;
                        }
                        self._isWaitingForAnyKeyToContinue = true;
                        self._largeDisplay.set(self._getErrorMessage(reason), { center: true });
                    });
                return true;
            }
            else if (this._registry === 'EKV' || this._registry === 'MOT')
            {
                if (e.key === 'KVI' && this._currentMessage) {
                    this._editMessage.openNewReceiptMessage(this._currentMessage);
                    handled = true;
                }
                else if (e.key === 'REP' && this._currentMessage) {
                    this._editMessage.openNewRepeatMessage(this._currentMessage);
                    handled = true;
                }
            }
            else if (e.key === 'SKR') {
                this._printer.print(this._currentMessage);
                handled = true;
            }
            else if (/^F[1-4]$/.test(e.key)) {
                this._messages.save(e.key, this._currentMessage);
                handled = true;
            }
        }
    }

    if (e.key === 'RAD') {
        if (this._currentMessage && !(this._isWaitingForAnyKeyToContinue && !this._deleteCount)) {
            this._deleteCount++;
            if (this._deleteCount === 2) {
                this._messages.remove(this._currentMessage);
            }
            else {
                this._isWaitingForAnyKeyToContinue = true;
            }

            this.update();
            handled = true;
        }
    }
    else {
        if (this._deleteCount > 0) {
            this._isWaitingForAnyKeyToContinue = false;
            this._nextMessage(0);
        }
        this._deleteCount = 0;
    }

    return handled;
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

    this._isWaitingForAnyKeyToContinue = false;
    this._deleteCount = 0;
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

    if (!this._deleteCount) {
        this._largeDisplay.set(this._currentMessage.toString(this._row));
    }
    else if (this._deleteCount === 1) {
        this._largeDisplay.set('VILL DU RADERA?');
    }
    else if (this._deleteCount === 2) {
        this._largeDisplay.set('RADERAT', { center: true });
        this._smallDisplay.clear();
        return;
    }

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