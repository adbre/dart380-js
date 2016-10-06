'use strict';

var _ = require('lodash');

var formats = require('./MessageFormats');

var Message = require('./Message');

function Messages(memory) {
    this._memory = memory;

    this._messageFormats = [];
    this._initFormats(formats);
}

module.exports = Messages;

Messages.$inject = ['memory'];

Messages.prototype.getWritten = function (message) {
    return this.get('ISK');
};

Messages.prototype.getSent = function (message) {
    return this.get('AVS');
};

Messages.prototype.getReceived = function (message) {
    return this.get('MOT');
};

Messages.prototype.getConfirmed = function (message) {
    return this.get('EKV');
};

Messages.prototype.saveReceived = function (message) {
    this.save('EKV', message);
};

Messages.prototype.saveWritten = function (message) {
    this.save('ISK', message);
};

Messages.prototype.setAsSent = function (message) {
    this.removeById('ISK', message.id);
    this.save('AVS', message);
};

Messages.prototype.setAsConfirmed = function (message) {
    this.removeById('EKV', message.id);
    this.save('MOT', message);
};

Messages.prototype.remove = function (message) {
    this.removeById('EKV', message.id);
    this.removeById('MOT', message.id);
    this.removeById('AVS', message.id);
    this.removeById('ISK', message.id);
};

Messages.prototype.get = function (key) {
    var messages = this._readFromMemory(key) || [];
    return _.map(messages, function (message) {
        return this.createMessage(message);
    }.bind(this));
};

Messages.prototype.save = function (key, message) {
    var messages = this.get(key);
    if (!message.id) {
        message.id = this._getNextId();
    }
    messages.unshift(message);
    this._saveInMemory(key, _.map(messages, function (message) {
        return message.toArray();
    }));
};

Messages.prototype.removeById = function (key, id) {
    this._saveInMemory(key, _.filter(this.get(key), function (msg) {
        return msg.id !== id;
    }));
};

Messages.prototype._getNextId = function () {
    var nextId = this._readFromMemory('nextId') || 1;
    this._saveInMemory('nextId', nextId + 1);
    return nextId;
};

Messages.prototype._saveInMemory = function (key, value) {
    return this._memory.set('messages.' + key, value);
};

Messages.prototype._readFromMemory = function (key) {
    return this._memory.get('messages.' + key);
};

Messages.prototype.getFormat = function (value) {
    var match = ((value || '').toString()).match(/^([0-9])([0-9])?([0-9])?$/);
    if (!match) {
        return formats;
    }

    return getFormat(formats, [match[1], match[2], match[3]]);
};

Messages.prototype._initFormats = function (menu, parent, num) {
    menu.parent = parent;
    menu.value = ((parent && parent.value) || '') + (num || '');

    var self = this;

    if (menu.value.length === 3) {
        this._messageFormats.push(menu);
        this._initMessageFormat(menu);
    }

    _.forEach(menu, function (value, propertyName) {
        if (/^[0-9]$/.test(propertyName) && _.isObject(value)) {
            self._initFormats(value, menu, propertyName);
        }
    });
};

Messages.prototype.createMessage = function (message) {
    if (_.isArray(message)) {
        var needle = message[0].trim();
        var format = _.find(this._messageFormats, function (format) {
            return format.nameLong === needle;
        });

        return new Message(format, message.slice(1, message.length - 1));
    }
    else if (/^[0-9]{3}$/.test(message)) {
        return new Message(this.getFormat(message));
    }

    return false;
};

Messages.prototype._initMessageFormat = function (format) {
    format.getLines = function () {
        return [
            'TILL:           ',
            '                ',
            '      *FR:      ',
            '                ',
            'FRÅN:     *U:   ',
            'TEXT:           ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                '
        ];
    };

    if (format.value === '104') {
        format.getLines = function () {
            return [
                'TILL:           ',
                '                ',
                '      *FR:      ',
                '                ',
                'FRÅN:     *U:   ',
                'KVITTENS:      *'
            ];
        };
    }
};

function getFormat(menu, values) {
    var value = values.shift();
    if (_.isUndefined(value)) {
        return menu;
    }
    else {
        var child = menu[value];
        if (!child) {
            return false;
        }
        else {
            return getFormat(child, values);
        }
    }
}

function initFormats(menu, parent, num) {

}