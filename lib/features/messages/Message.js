'use strict';

var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

var ENDOFMESSAGE = '------SLUT------';

function Message(format, lines)
{
    this.format = format;
    this._template = format.getLines().slice();
    this._message = (lines || this._template).slice();
}

module.exports = Message;

Message.prototype.rowCount = function () {
    return this._message.length;
};

Message.prototype.toString = function (row) {
    if (!_.isUndefined(row) && this._message[row]) {
        return this._message[row];
    }
    else if (row === this._message.length) {
        return ENDOFMESSAGE;
    }
    else if (row === false) {
        return this._message.join('');
    }
    else {
        return this.toArray().join('\n');
    }
};

Message.prototype.toArray = function () {
    return [].concat([
        _.padEnd(this.format.nameLong, 16) ],
        this._message.slice(),
        [ ENDOFMESSAGE ]
    );
};

Message.prototype.getHeaderArray = function () {
    return this._message.slice(0, 5);
};

Message.prototype.getBodyArray = function () {
    return this._message.slice(5);
};

Message.prototype.writeAt = function (row, col, text, reverse) {
    while (text.length > 0 && row < this._message.length) {
        var c = text.substr(0, 1);
        text = text.substr(1);

        if (this._template[row][col] !== ' ') {
            throw new Error('given row and column is write protected');
        }

        var line = this._message[row];
        var before = line.substr(0, col);
        var after = line.substr(col + 1);
        this._message[row] = before + c + after;

        var pos = this.nextWriteableCell(row, col, reverse ? -1 : 1);
        col = pos.col;
        row = pos.row;
    }

    return { row: row, col: col };
};

Message.prototype.nextWriteableCell = function (row, col, step) {
    do {
        if (step > 0 && col < 15) {
            col += step;
        }
        else if (step < 0 && col > 0) {
            col += step;
        }
        else if (step > 0 && row < this._template.length - 1) {
            col = 0;
            row++;
        }
        else if (step < 0 && row > 0) {
            col = 15;
            row--;
        }
        else {
            break;
        }
    } while (this._template[row][col] !== ' ');

    return { row: row, col: col };
};

Message.prototype.firstWriteableCell = function (row) {
    row = row || 0;
    return { row: row, col: this._template[row].indexOf(' ')};
};

Message.prototype.setTimestamp = function (time) {
    if (!_.isString(time)) {
        time = sprintf('%02d%02d%02d', time.hour, time.minute, time.second);
    }

    this.writeAt(2,0, time);
};

Message.prototype.setSender = function (address) {
    this.writeAt(2,10, address === '*' ? '' : address);
};

Message.prototype.setRecipent = function (recipent) {
    this.writeAt(0, 5, recipent);
};

Message.prototype.withTimestamp = function (time) {
    this.setTimestamp(time);
    return this;
};

Message.prototype.withSender = function (address) {
    this.setSender(address);
    return this;
};

Message.prototype.getRecipent = function () {
    return this.read(0, 5, 27).trim();
};

Message.prototype.getTimestamp = function () {
    return this.read(2, 0, 6).trim();
};

Message.prototype.getSender = function () {
    return this.read(2, 10, 22).trim();
};

Message.prototype.getRecipents = function () {
    return this.getRecipent().trim().split(',');
};

Message.prototype.setText = function (text) {
    this.writeAt(5, 5, text);
};

Message.prototype.read = function (startRow, startCol, length) {
    return this.toString(false).substr((startRow * 16) + startCol, length);
};

Message.prototype.setReference = function (tnr) {
    if (!/^[0-9]{6}$/.test(tnr)) {
        throw new Error('Reference must be a six digit timestamp');
    }
    if (this.format.value === '104') {
        this.writeAt(5, 9, tnr);
    }
};
