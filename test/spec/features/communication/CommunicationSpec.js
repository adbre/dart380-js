'use strict';

var _ = require('lodash');

require('../../../TestHelper');

var MockCommunication = require('../../../util/MockCommunication');

describe("communication", function() {

    beforeEach(bootstrapDart380({ modules: [ MockCommunication.module ]}));

    beforeEach(inject(function(mod, selfTest, eventBus) {
        var isReady = false;
        eventBus.on('ready', function () {
            isReady = true;
        });
        mod.set(mod.SKYDD);
        while (!isReady) {
            jasmine.clock().tick(1000);
        }
    }));

    function createFmt100(to, text, tnr) {
        inject(function (keyboard) {
            keyboard.trigger('FMT');
            keyboard.triggerMany('100');
            keyboard.trigger('⏎'); // FRI*TEXT
            keyboard.trigger('⏎'); // TILL:
            keyboard.trigger('ÄND');
            keyboard.triggerMany(to);
            keyboard.trigger('⏎'); // (empty)
            keyboard.trigger('⏎'); // 010000*FR:
            if (tnr) {
                keyboard.triggerMany(tnr);
            }
            keyboard.trigger('⏎'); // (empty)
            keyboard.trigger('⏎'); // FRÅN:     *U:
            keyboard.trigger('⏎'); // TEXT:
            keyboard.triggerMany(text);
            keyboard.trigger('SLT');
            keyboard.trigger('SLT');
        })();
    }

    beforeEach(inject(function (dda, time, kda) {
        dda.setAddress('CR');
        time.setTime('154012');
        time.setDate('0922');
        kda.setActiveKey({ groups: [1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111], checksum: '000' });
    }));

    describe('receiving message', function () {

        var message = [
            'FRI*TEXT*       ',
            'TILL:CR         ',
            '                ',
            '221540*FR:RG    ',
            '                ',
            'FRÅN:     *U:   ',
            'TEXT:LOREM IPSUM',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '------SLUT------',
        ];

        function withRecipent(recipent, message) {
            if (_.isArray(recipent)) {
                recipent = recipent.join(',');
            }
            message = message.slice();
            message[1] = _.padEnd(message[1].substr(0, 5) + recipent.substr(0, 11), 16);
            message[2] = _.padEnd(recipent.substr(11), 16);
            return message;
        }

        it('should receive message in EKV', inject(function (communication, keyboard, largeDisplay, smallDisplay) {
            // given
            communication.receive(message);

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('221540*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it('should fire event when receiving', inject(function (communication, eventBus) {
            var eventHandler = jasmine.createSpy('eventHandler');
            eventBus.on('communication.received', eventHandler);

            // when
            communication.receive(message);

            // then
            expect(eventHandler).toHaveBeenCalled();
        }));

        it('should add opm-message when received message', inject(function (communication, keyboard, smallDisplay) {
            // given
            communication.receive(message);

            // when
            keyboard.trigger('OPM');

            // then
            expect(smallDisplay.toString()).toBe('DATAMEDD');
        }));

        it('should NOT receive message in EKV when not addressed to us', inject(function (communication, keyboard, largeDisplay, smallDisplay) {
            // given
            communication.receive(withRecipent('AR', message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('(MOTT EJ KVITT) ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it('should NOT fire event', inject(function (communication, eventBus) {
            var eventHandler = jasmine.createSpy('eventHandler');
            eventBus.on('communication.received', eventHandler);

            // when
            communication.receive(withRecipent('AR', message));

            // then
            expect(eventHandler).not.toHaveBeenCalled();
        }));

        it('should NOT add opm-message', inject(function (communication, keyboard, smallDisplay) {
            // given
            communication.receive(withRecipent('AR', message));

            // when
            keyboard.trigger('OPM');

            // then
            expect(smallDisplay.toString()).not.toBe('DATAMEDD');
        }));

        it('should receive message in EKV when our address is *', inject(function (communication, dda, keyboard, largeDisplay, smallDisplay) {
            // given
            dda.setAddress('*');
            communication.receive(withRecipent(['AR', 'BR', 'CR'], message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('221540*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it('should receive message sent to any recipent with two characters, when our address is **', inject(function (communication, dda, keyboard, largeDisplay, smallDisplay) {
            // given
            dda.setAddress('**');
            communication.receive(withRecipent('AR', message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('221540*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it('should NOT receive message sent to any recipent with three characters, when our address is **', inject(function (communication, dda, keyboard, largeDisplay, smallDisplay) {
            // given
            dda.setAddress('**');
            communication.receive(withRecipent('ABC', message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('(MOTT EJ KVITT) ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it('should receive message sent to a recipent matching our address mask', inject(function (communication, dda, keyboard, largeDisplay, smallDisplay) {
            // given
            dda.setAddress('CR*');
            communication.receive(withRecipent('CR1', message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('221540*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it('should NOT receive message sent to a recipent NOT matching our address mask', inject(function (communication, dda, keyboard, largeDisplay, smallDisplay) {
            // given
            dda.setAddress('CR*');
            communication.receive(withRecipent('AR1', message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('(MOTT EJ KVITT) ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it('should receive message in EKV when addressed to many, including us', inject(function (communication, keyboard, largeDisplay, smallDisplay) {
            // given
            communication.receive(withRecipent(['AR', 'BR', 'CR'], message));

            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('221540*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

    });

    describe('sending message', function () {

        describe('message sent', function () {
            beforeEach(inject(function (mockCommunication, keyboard) {
                createFmt100('RG', 'LOREM IPSUM');
                keyboard.trigger('ISK');
                keyboard.trigger('SND');
            }));

            it('should define .toArray() function', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.toArray()).toEqual([
                    'FRI*TEXT*       ',
                    'TILL:RG         ',
                    '                ',
                    '221540*FR:CR    ',
                    '                ',
                    'FRÅN:     *U:   ',
                    'TEXT:LOREM IPSUM',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '------SLUT------',
                ]);
            }));

            it('should define .getHeaderArray() function', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.getHeaderArray()).toEqual([
                    'TILL:RG         ',
                    '                ',
                    '221540*FR:CR    ',
                    '                ',
                    'FRÅN:     *U:   '
                ]);
            }));

            it('should define .getBodyArray() function', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.getBodyArray()).toEqual([
                    'TEXT:LOREM IPSUM',
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
                ]);
            }));

            it('should define .toString() function', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.toString().split('\n')).toEqual([
                    'FRI*TEXT*       ',
                    'TILL:RG         ',
                    '                ',
                    '221540*FR:CR    ',
                    '                ',
                    'FRÅN:     *U:   ',
                    'TEXT:LOREM IPSUM',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '                ',
                    '------SLUT------',
                ]);
            }));

            it('should define .getRecipent()', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.getRecipent()).toBe('RG');
            }));

            it('should define .getTimestamp()', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.getTimestamp()).toBe('221540');
            }));

            it('should define .getSender()', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.getSender()).toBe('CR');
            }));

            it('should define .format.value', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.format.value).toEqual('100');
            }));

            it('should define .format.nameLong', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.format.nameLong).toEqual('FRI*TEXT*');
            }));

            it('should define .format.nameShort', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().message.format.nameShort).toEqual('FRI*TEXT');
            }));
        });

        describe('synchronization context', function () {
            beforeEach(inject(function (mockCommunication, keyboard) {
                createFmt100('RG', 'LOREM IPSUM');
                keyboard.trigger('ISK');
                keyboard.trigger('SND');
            }));

            it('should pass context to communication provider', inject(function (mockCommunication) {
                // then
                expect(mockCommunication.mostRecent().context).toMatch(/^.+$/);
            }));

            describe('channel data based', function () {

                it('should change when frequency changes', inject(function (kda, communication) {
                    // given
                    var notExpected = communication.getContext();

                    // when
                    kda.setFrequency('41234');

                    // then
                    expect(communication.getContext()).not.toEqual(notExpected);
                }));

                it('should change when bd1 changes', inject(function (kda, communication) {
                    // given
                    var notExpected = communication.getContext();

                    // when
                    kda.setBd1('4050');

                    // then
                    expect(communication.getContext()).not.toEqual(notExpected);
                }));

                it('should change when bd2 changes', inject(function (kda, communication) {
                    // given
                    var notExpected = communication.getContext();

                    // when
                    kda.setBd2('7075');

                    // then
                    expect(communication.getContext()).not.toEqual(notExpected);
                }));

                it('should change when active key changes', inject(function (kda, keyChecksum, communication) {
                    // given
                    var notExpected = communication.getContext();

                    // when
                    kda.setActiveKey(keyChecksum.generate());

                    // then
                    expect(communication.getContext()).not.toEqual(notExpected);
                }));

                it('should fire communication.context.changed event when frequency changes', inject(function (kda, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    kda.setFrequency('41234');

                    // then
                    expect(event).toHaveBeenCalled();
                }));

                it('should fire communication.context.changed event when BD1 changes', inject(function (kda, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    kda.setBd1('4050');

                    // then
                    expect(event).toHaveBeenCalled();
                }));

                it('should fire communication.context.changed event when BD2 changes', inject(function (kda, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    kda.setBd2('7075');

                    // then
                    expect(event).toHaveBeenCalled();
                }));

                it('should fire communication.context.changed event when active key changes', inject(function (kda, keyChecksum, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    kda.setActiveKey(keyChecksum.generate());

                    // then
                    expect(event).toHaveBeenCalled();
                }));

                it('should pass context to context.changed event', inject(function (kda, keyChecksum, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    kda.setActiveKey(keyChecksum.generate());

                    // then
                    expect(event.calls.mostRecent().args[0].context).toMatch(/^.+$/);
                }));
            });

            describe('timestamp based', function () {

                it('should fire communication.context.changed event at XX:15', inject(function (time, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    time.setTime('001459');

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(event).toHaveBeenCalled();
                }));

                it('should fire communication.context.changed event at XX:45', inject(function (time, eventBus) {
                    // given
                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    time.setTime('004459');

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(event).toHaveBeenCalled();
                }));

                it('should NOT fire communication.context.changed event at XX:00', inject(function (time, eventBus) {
                    // given
                    time.setTime('005959');

                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(event).not.toHaveBeenCalled();
                }));

                it('should NOT fire communication.context.changed event at XX:30', inject(function (time, eventBus) {
                    // given
                    time.setTime('002959');

                    var event = jasmine.createSpy('event');
                    eventBus.on('communication.context.changed', event);

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(event).not.toHaveBeenCalled();
                }));

                it('should change at XX15', inject(function (time, communication) {
                    // given
                    time.setTime('121459');
                    var notExpected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).not.toEqual(notExpected);
                }));

                it('should change at XX45', inject(function (time, communication) {
                    // given
                    time.setTime('124459');
                    var notExpected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).not.toEqual(notExpected);
                }));

                it('should NOT change at XX00', inject(function (time, communication) {
                    // given
                    time.setTime('125959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change at XX30', inject(function (time, communication) {
                    // given
                    time.setTime('122959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 middle of month', inject(function (time, communication) {
                    // given
                    time.setDate('0115');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on january 1st', inject(function (time, communication) {
                    // given
                    time.setDate('1231');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on february 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0131');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on march 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0228');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on april 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0331');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on may 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0430');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on june 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0531');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on july 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0630');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on august 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0731');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on september 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0831');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on october 1st', inject(function (time, communication) {
                    // given
                    time.setDate('0930');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on november 1st', inject(function (time, communication) {
                    // given
                    time.setDate('1031');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));

                it('should NOT change context at 00:00 on december 1st', inject(function (time, communication) {
                    // given
                    time.setDate('1130');
                    time.setTime('235959');
                    var expected = communication.getContext();

                    // when
                    jasmine.clock().tick(1000);

                    // then
                    expect(communication.getContext()).toEqual(expected);
                }));
            });
        });
    });
});