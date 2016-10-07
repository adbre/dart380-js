'use strict';

require('../../../TestHelper');

describe("F1-F4", function() {

    beforeEach(bootstrapDart380());

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

    beforeEach(function () {
        createFmt100('RG', 'THE QUICK BROWN FOX JUMPS THE LAZY DOG');
    });

    it("should save message with F1", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('ISK');
        keyboard.trigger('F1');
        keyboard.trigger('SLT');
        keyboard.trigger('F1');

        // then
        expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should save message with F2", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('ISK');
        keyboard.trigger('F2');
        keyboard.trigger('SLT');
        keyboard.trigger('F2');

        // then
        expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should save message with F3", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('ISK');
        keyboard.trigger('F3');
        keyboard.trigger('SLT');
        keyboard.trigger('F3');

        // then
        expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should save message with F4", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('ISK');
        keyboard.trigger('F4');
        keyboard.trigger('SLT');
        keyboard.trigger('F4');

        // then
        expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should overwrite next Fn key if not using SLT between", inject(function (time, keyboard, largeDisplay, smallDisplay) {
        // given
        time.setTime('130000');
        createFmt100('AR', 'LOREM IPSUM');

        keyboard.trigger('ISK');
        keyboard.trigger('F2');
        keyboard.trigger('▽');
        keyboard.trigger('F1');
        keyboard.trigger('SLT');

        // when
        keyboard.trigger('F1');
        keyboard.trigger('F2');

        // then
        keyboard.trigger('SLT');
        keyboard.trigger('F2');
        expect(largeDisplay.toString()).toBe('120000*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));
});