'use strict';

var _ = require('lodash');

require('../../../TestHelper');

var MockCommunication = require('../../../util/MockCommunication');
var MockPrinter = require('../../../util/MockPrinter');



describe("communication", function() {

    beforeEach(bootstrapDart380({ modules: [ MockCommunication.module, MockPrinter.module ]}));

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
            keyboard.trigger('⏎'); // 000000*FR:
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
        kda.setActiveKey({ groups: [1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111], checksum: '000' });
    }));

    describe('manual printing (MAN)', function () {
        beforeEach(inject(function (dda) {
            dda.setSkr('MAN');
        }));

        it('should print message from ISK', inject(function (keyboard, mockPrinter) {
            // given
            createFmt100('RG', 'THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            keyboard.trigger('ISK');
            keyboard.trigger('SKR');

            // then
            expect(mockPrinter.mostRecent()).toBeDefined();
            expect(mockPrinter.mostRecent().message.toArray()).toEqual([
                'FRI*TEXT*       ',
                'TILL:RG         ',
                '                ',
                '000000*FR:CR    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:THE QUICK B',
                'ROWN FOX JUMPS T',
                'HE LAZY DOG.    ',
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

        it('should print message from EKV', inject(function (keyboard, messages, communication, mockPrinter) {
            // given
            var message = messages.createMessage('100');
            message.setSender('RG');
            message.setRecipent('CR');
            message.setTimestamp('172400');
            message.setText('THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            communication.receive(message.toArray());
            keyboard.trigger('EKV');
            keyboard.trigger('SKR');

            // then
            expect(mockPrinter.mostRecent()).toBeDefined();
            expect(mockPrinter.mostRecent().message.toArray()).toEqual([
                'FRI*TEXT*       ',
                'TILL:CR         ',
                '                ',
                '172400*FR:RG    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:THE QUICK B',
                'ROWN FOX JUMPS T',
                'HE LAZY DOG.    ',
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

        it('should NOT auto-print message when sending', inject(function (keyboard, mockPrinter) {
            // given
            createFmt100('RG', 'THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            keyboard.trigger('ISK');
            keyboard.trigger('SND');

            // then
            expect(mockPrinter.mostRecent()).not.toBeDefined();
        }));

        it('should NOT auto-print message when receiving', inject(function (keyboard, messages, communication, mockPrinter) {
            // given
            var message = messages.createMessage('100');
            message.setSender('RG');
            message.setRecipent('CR');
            message.setTimestamp('172400');
            message.setText('THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            communication.receive(message.toArray());

            // then
            expect(mockPrinter.mostRecent()).not.toBeDefined();
        }));
    });

    describe('automatic printing of received (MOT)', function () {
        beforeEach(inject(function (dda) {
            dda.setSkr('MOT');
        }));

        it('should NOT print message when sending', inject(function (keyboard, mockPrinter) {

            // given
            createFmt100('RG', 'THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            keyboard.trigger('ISK');
            keyboard.trigger('SND');

            // then
            expect(mockPrinter.mostRecent()).not.toBeDefined();
        }));

        it('should auto-print message when receiving', inject(function (keyboard, messages, communication, mockPrinter) {
            // given
            var message = messages.createMessage('100');
            message.setSender('RG');
            message.setRecipent('CR');
            message.setTimestamp('172400');
            message.setText('THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            communication.receive(message.toArray());

            // then
            expect(mockPrinter.mostRecent()).toBeDefined();
            expect(mockPrinter.mostRecent().message.toArray()).toEqual([
                'FRI*TEXT*       ',
                'TILL:CR         ',
                '                ',
                '172400*FR:RG    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:THE QUICK B',
                'ROWN FOX JUMPS T',
                'HE LAZY DOG.    ',
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
    });

    describe('automatic printing of all (ALLA)', function () {
        beforeEach(inject(function (dda) {
            dda.setSkr('ALLA');
        }));

        it('should print message when sending', inject(function (keyboard, mockPrinter) {

            // given
            createFmt100('RG', 'THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            keyboard.trigger('ISK');
            keyboard.trigger('SND');

            // then
            expect(mockPrinter.mostRecent()).toBeDefined();
            expect(mockPrinter.mostRecent().message.toArray()).toEqual([
                'FRI*TEXT*       ',
                'TILL:RG         ',
                '                ',
                '000000*FR:CR    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:THE QUICK B',
                'ROWN FOX JUMPS T',
                'HE LAZY DOG.    ',
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

        it('should auto-print message when receiving', inject(function (keyboard, messages, communication, mockPrinter) {
            // given
            var message = messages.createMessage('100');
            message.setSender('RG');
            message.setRecipent('CR');
            message.setTimestamp('172400');
            message.setText('THE QUICK BROWN FOX JUMPS THE LAZY DOG.');

            // when
            communication.receive(message.toArray());

            // then
            expect(mockPrinter.mostRecent()).toBeDefined();
            expect(mockPrinter.mostRecent().message.toArray()).toEqual([
                'FRI*TEXT*       ',
                'TILL:CR         ',
                '                ',
                '172400*FR:RG    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:THE QUICK B',
                'ROWN FOX JUMPS T',
                'HE LAZY DOG.    ',
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
    });
});