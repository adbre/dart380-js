'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');
var Message = require('./../../messages/Message');

function EditMessage(injector, eventBus, menu, largeDisplay, smallDisplay, messages, time, dda, communication) {
    injector.invoke(MenuBase, this);

    this._menu = menu;
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._messages = messages;
    this._time = time;
    this._dda = dda;
    this._communication = communication;
}

inherits(EditMessage, MenuBase);

module.exports = EditMessage;

EditMessage.$inject = [
    'injector',
    'eventBus',
    'menu',
    'largeDisplay',
    'smallDisplay',
    'messages',
    'time',
    'dda',
    'communication'
];

EditMessage.prototype.createMessage = function (messageFormat) {
    this.edit(this._createMessage(messageFormat));
};

EditMessage.prototype.createReceipt = function (message) {
    var receipt = this._createMessage('104');
    receipt.setReference(message.getTimestamp());
    receipt.setRecipent(message.getSender());
    this.edit(receipt);
};

EditMessage.prototype._createMessage = function (format) {
    if (!_.isObject(format)) {
        format = this._messages.getFormat(format);
    }

    var message = new Message(format);
    message.setTimestamp(this._time.get());
    message.setSender(this._dda.getAd());
    return message;
};

EditMessage.prototype.edit = function (message) {
    this._message = message;
    this._messageFormat = message.format;
    this._row = -1;
    this._menu.openChild(this);
};

EditMessage.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this.update();
};

EditMessage.prototype.write = function (text) {
    var col = this._largeDisplay.getCursor();
    var pos = this._message.writeAt(this._row, col, text);
    this._largeDisplay.setCursor(pos.col);
    this._row = pos.row;
};

EditMessage.prototype.startEdit = function () {
    this._isEditing = true;
    this._largeDisplay.setCursor(this._message.firstWriteableCell(this._row).col);
    this.update();
};

EditMessage.prototype.endEdit = function () {
    this._isEditing = false;
    this._largeDisplay.noCursor();
    this.update();
};

EditMessage.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'SLT') {
        if (this._isEditing) {
            this.endEdit();
        }
        else {
            this._messages.save('ISK', this._message);

            this._largeDisplay.clear();
            this._smallDisplay.clear();

            this.close();
        }
        return true;
    }
    else if (e.key === 'SND') {
        this._largeDisplay.clear();
        this._smallDisplay.clear();

        this._largeDisplay.set('SÄNDER', { center: true });
        var self = this;
        this._communication.send(this._message)
            .then(function () {
                self._largeDisplay.set('SÄNT', { center: true });
            })
            .catch(function () {
                self._largeDisplay.set('UPPTAGET', { center: true });
            });

    }
    else if (e.key == '⏎') {
        this._row = Math.min(this._message.rowCount(), this._row+1);
        if (this._row === this._message.rowCount()) {
            this.endEdit();
        }
        else if (this._isEditing) {
            var cursor = this._message.firstWriteableCell(this._row).col;
            this._largeDisplay.setCursor(cursor);
        }
        this.update();
        return true;
    }
    else if (e.key === 'ÄND' && this._row >= 0) {
        this.startEdit();
        return true;
    }
    else if (e.key === '△') {

    }
    else if (e.key === '▽') {

    }
    else if (e.key === '→') {
        var pos = this._message.nextWriteableCell(this._row, this._largeDisplay.getCursor(), 1);
        this._row = pos.row;
        this._largeDisplay.setCursor(pos.col);
        this.update();
        return true;
    }
    else if (e.key === '←') {
        var pos = this._message.nextWriteableCell(this._row, this._largeDisplay.getCursor(), -1);
        this._row = pos.row;
        this._largeDisplay.setCursor(pos.col);
        this.update();
        return true;
    }
    else if (e.key === '↑') {
        this._row = Math.max(0, this._row - 1);
        this.update();
        return true;
    }
    else if (e.key === '↓') {
        this._row = Math.min(this._message.rowCount(), this._row + 1);
        this.update();
        return true;
    }
    else if (/^.$/.test(e.key) && this._isEditing) {
        this.write(e.key);
        this.update();
        return true;
    }

    return false;
};

EditMessage.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    if (this._row < 0)
    {
        this._largeDisplay.set(this._messageFormat.nameLong);
        this._smallDisplay.set(this._messageFormat.nameShort);
    }
    else if (this._row === this._message.rowCount()) {
        this._largeDisplay.set('------SLUT------');
    }
    else {
        this._largeDisplay.set(this._message.toString(this._row));
    }
};
