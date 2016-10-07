'use strict';

require('../../../TestHelper');

var MockCommunication = require('../../../util/MockCommunication');

describe("ISK", function() {

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

    it("should not have any messages in ISK", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('ISK');

        // then
        expect(largeDisplay.toString()).toBe('  (INSKRIVNA)   ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    describe('when message has been created', function () {

        beforeEach(function () {
            createFmt100('RG', 'THE QUICK BROWN FOX JUMPS THE LAZY DOG');
        });

        it("should show message in ISK menu", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('ISK');

            // then
            expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it("should be noop to press REP", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('ISK');

            // when
            keyboard.trigger('REP');

            // then
            expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it("should be noop to press KVI", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('ISK');

            // when
            keyboard.trigger('KVI');

            // then
            expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it("should ask for delete confirmation", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('ISK');

            // when
            keyboard.trigger('RAD');

            // then
            expect(largeDisplay.toString()).toBe('VILL DU RADERA? ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it("should confirm deletion", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('ISK');

            // when
            keyboard.trigger('RAD');
            keyboard.trigger('RAD');

            // then
            expect(largeDisplay.toString()).toBe('    RADERAT     ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it("should quit deletion", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('ISK');

            // when
            keyboard.trigger('RAD');
            keyboard.trigger('RAD');
            keyboard.trigger('SLT');

            // then
            expect(largeDisplay.toString()).toBe('                ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

        it("should delete message", inject(function (keyboard, largeDisplay, smallDisplay) {

            // given
            keyboard.trigger('ISK');

            // when
            keyboard.trigger('RAD');
            keyboard.trigger('RAD');
            keyboard.trigger('SLT');
            keyboard.trigger('ISK');

            // then
            expect(largeDisplay.toString()).toBe('  (INSKRIVNA)   ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

    });
});