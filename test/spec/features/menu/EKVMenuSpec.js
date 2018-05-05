'use strict';

require('../../../TestHelper');

var MockCommunication = require('../../../util/MockCommunication');

describe("EKV", function() {

    beforeEach(bootstrapDart380({ modules: [
        {
            __init__: ['mockCommunication'],
            mockCommunication: ['type', MockCommunication]
        }
    ]}));

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

    beforeEach(inject(function (dda, time, kda) {
        dda.setAddress('CR');
        time.setTime('120000');
        time.setDate('0101');
        kda.setActiveKey({ groups: [1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111], checksum: '000' });
    }));

    it("should open EKV menu", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('EKV');

        expect(largeDisplay.toString()).toBe('(MOTT EJ KVITT) ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    describe('when receiving a message', function () {

        beforeEach(inject(function (communication) {
            communication.receive([
                'FRI*TEXT*       ',
                'TILL:CR         ',
                '                ',
                '154012*FR:RG    ',
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

        it("should show message in EKV menu", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('154012*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it("should NOT show message in MOT menu", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('MOT');

            // then
            expect(largeDisplay.toString()).toBe('   (MOTTAGNA)   ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it("should create repeat message with REP", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('EKV');
            keyboard.trigger('REP');

            // then
            expect(largeDisplay.toString()).toBe('REPETERA*       ');
            expect(smallDisplay.toString()).toBe('REPETERA');
        }));

        it("should create receipt with KVI", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('EKV');
            keyboard.trigger('KVI');

            // then
            expect(largeDisplay.toString()).toBe('KVITTENS*       ');
            expect(smallDisplay.toString()).toBe('KVITTENS');
        }));

        it("should create and show receipt with KVI", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('EKV');
            keyboard.trigger('KVI');

            expect(largeDisplay.toString()).toBe('KVITTENS*       ');
            expect(smallDisplay.toString()).toBe('KVITTENS');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('TILL:RG         ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('                ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('011200*FR:CR    ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('                ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('FRÅN:     *U:   ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('KVITTENS:154012*');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('                ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('                ');

            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).toBe('------SLUT------');

            keyboard.trigger('SND');
            expect(largeDisplay.toString()).toBe('     SÄNDER     ');
        }));

        it("should send receipt", inject(function (keyboard, largeDisplay, smallDisplay, mockCommunication) {
            // when
            keyboard.trigger('EKV');
            keyboard.trigger('KVI');
            keyboard.trigger('SND');

            expect(largeDisplay.toString()).toBe('     SÄNDER     ');
            mockCommunication.mostRecent().complete();
            expect(largeDisplay.toString()).toBe('      SÄNT      ');

            keyboard.trigger('SLT');
            expect(largeDisplay.toString()).toBe('                ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it("should NOT edit message", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('EKV');

            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('202634');

            // then
            expect(largeDisplay.toString()).toBe('154012*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

    });
});