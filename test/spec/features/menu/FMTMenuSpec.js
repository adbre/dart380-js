'use strict';

require('../../../TestHelper');

describe("FMT", function() {

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

    it("should open message format selection", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
        expect(largeDisplay.getCursor()).toBe(7);
        expect(smallDisplay.getCursor()).toBe(-1);
    }));

    it("should cancel message format selection", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');

        // when
        keyboard.trigger('SLT');

        // then
        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    // DART 380 Instruktionsbok Utdrag, sida 25
    it("Formatnummer saknas", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('998');

        expect(largeDisplay.toString()).toBe('FORMAT:998      ');
        expect(smallDisplay.toString()).toBe('SAKNAS  ');
    }));

    // DART 380 Instruktionsbok Utdrag, sida 25
    it("Nummerval av format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');

        keyboard.trigger('1');

        expect(largeDisplay.toString()).toBe('FORMAT:1        ');
        expect(smallDisplay.toString()).toBe('LEDNING ');

        keyboard.trigger('0');

        expect(largeDisplay.toString()).toBe('FORMAT:10       ');
        expect(smallDisplay.toString()).toBe('LEDNSBTJ');

        keyboard.trigger('3');

        expect(largeDisplay.toString()).toBe('FORMAT:103      ');
        expect(smallDisplay.toString()).toBe('FÖRBPROV');
    }));

    // DART 380 Instruktionsbok Utdrag, sida 25
    it("Söka format i formatträd", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');

        keyboard.trigger('→');

        expect(largeDisplay.toString()).toBe('FORMAT:0        ');
        expect(smallDisplay.toString()).toBe('RADIOFMT');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:1        ');
        expect(smallDisplay.toString()).toBe('LEDNING ');

        keyboard.trigger('→');

        expect(largeDisplay.toString()).toBe('FORMAT:10       ');
        expect(smallDisplay.toString()).toBe('LEDNSBTJ');

        keyboard.trigger('→');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:101      ');
        expect(smallDisplay.toString()).toBe('PASS*ALT');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:102      ');
        expect(smallDisplay.toString()).toBe('RANY*KRY');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:103      ');
        expect(smallDisplay.toString()).toBe('FÖRBPROV');
    }));

    it("Söka format i formatträd (bakåt)", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('103');

        expect(largeDisplay.toString()).toBe('FORMAT:103      ');
        expect(smallDisplay.toString()).toBe('FÖRBPROV');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:102      ');
        expect(smallDisplay.toString()).toBe('RANY*KRY');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:101      ');
        expect(smallDisplay.toString()).toBe('PASS*ALT');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:10       ');
        expect(smallDisplay.toString()).toBe('LEDNSBTJ');

        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:1        ');
        expect(smallDisplay.toString()).toBe('LEDNING ');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:0        ');
        expect(smallDisplay.toString()).toBe('RADIOFMT');

        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should not navigate UP outside format group", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        // when
        keyboard.trigger('↑');

        // then
        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should not navigate DOWN outside format group", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('209');

        // when
        keyboard.trigger('↓');

        // then
        expect(largeDisplay.toString()).toBe('FORMAT:209      ');
        expect(smallDisplay.toString()).toBe('FLBASSV2');
    }));

    it("should not navigate LEFT outside format group", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        // when
        keyboard.trigger('→');

        // then
        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should be no-op to press UP when in root format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should be no-op to press RIGHT when in root format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should be no-op to press DOWN when in root format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should enter message", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('FRI*TEXT*       ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('TILL:           ');

        keyboard.trigger('ÄND');

        expect(largeDisplay.toString()).toBe('TILL:           ');
        expect(largeDisplay.getCursor()).toBe(5);

        keyboard.triggerMany('VN,VK,ZF');

        expect(largeDisplay.toString()).toBe('TILL:VN,VK,ZF   ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('                ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('000000*FR:      ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('                ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('FRÅN:     *U:   ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('TEXT:           ');

        keyboard.triggerMany('BROWN FOX');

        expect(largeDisplay.toString()).toBe('TEXT:BROWN FOX  ');

        keyboard.trigger('SLT');

        expect(largeDisplay.toString()).toBe('TEXT:BROWN FOX  ');
        expect(largeDisplay.getCursor()).toBe(-1);

        keyboard.trigger('SLT');

        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should auto assign TNR", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('1');
        keyboard.trigger('ÄND');
        keyboard.triggerMany('232547');
        keyboard.trigger('⏎');
        keyboard.trigger('SLT');

        // when
        keyboard.trigger('FMT');
        keyboard.triggerMany('100'); // FORMAT:100
        keyboard.trigger('⏎'); // FRI*TEXT*
        keyboard.trigger('⏎'); // TILL:
        keyboard.trigger('⏎'); //
        keyboard.trigger('⏎'); //       *FR:

        // then
        expect(largeDisplay.toString()).toBe('232547*FR:      ');
    }));

    it("should auto wrap lines", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('FMT');
        keyboard.triggerMany('100'); // FORMAT:100
        keyboard.trigger('⏎'); // FRI*TEXT*
        keyboard.trigger('⏎'); // TILL:

        keyboard.trigger('ÄND');
        keyboard.triggerMany('ABCDEFGHIJKLM');

        // then
        expect(largeDisplay.toString()).toBe('LM              ');
    }));

    it("should move UP lines", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100'); // FORMAT:100
        keyboard.trigger('⏎'); // FRI*TEXT*
        keyboard.trigger('⏎'); // TILL:

        keyboard.trigger('ÄND');
        keyboard.triggerMany('ABCDEFGHIJKLM');

        // when
        keyboard.trigger('↑');

        // then
        expect(largeDisplay.toString()).toBe('TILL:ABCDEFGHIJK');
    }));

    it("should move DOWN lines", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100'); // FORMAT:100
        keyboard.trigger('⏎'); // FRI*TEXT*
        keyboard.trigger('⏎'); // TILL:

        keyboard.trigger('ÄND');
        keyboard.triggerMany('ABCDEFGHIJKLM');
        keyboard.trigger('↑');

        // when
        keyboard.trigger('↓');

        // then
        expect(largeDisplay.toString()).toBe('LM              ');
    }));

    it("should move cursor LEFT", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100'); // FORMAT:100
        keyboard.trigger('⏎'); // FRI*TEXT*
        keyboard.trigger('⏎'); // TILL:

        keyboard.trigger('ÄND');
        keyboard.triggerMany('ABCDEFGHIJKLM');

        // when
        keyboard.trigger('←');
        keyboard.trigger('N');

        // then
        expect(largeDisplay.toString()).toBe('LN              ');
    }));

    it("should move cursor RIGHT", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100'); // FORMAT:100
        keyboard.trigger('⏎'); // FRI*TEXT*
        keyboard.trigger('⏎'); // TILL:
        keyboard.trigger('⏎');

        keyboard.trigger('ÄND');

        // when
        keyboard.trigger('→');
        keyboard.triggerMany('ABC');

        // then
        expect(largeDisplay.toString()).toBe(' ABC            ');
    }));

    it("should have 16 lines in FMT 100 message", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('FRI*TEXT*       ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        for (var i=0; i < 16; i++) {
            keyboard.trigger('⏎');
            expect(largeDisplay.toString()).not.toBe('------SLUT------');
        }

        keyboard.trigger('⏎');
        expect(largeDisplay.toString()).toBe('------SLUT------');
    }));

    it("should automatically enter sender address", inject(function (keyboard, largeDisplay) {
        // given
        keyboard.trigger('DDA');
        keyboard.trigger('ÄND');
        keyboard.triggerMany('VJ');
        keyboard.trigger('⏎');
        keyboard.trigger('SLT');

        // when
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('ÄND');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');

        // then
        expect(largeDisplay.toString()).toBe('000000*FR:VJ    ');
    }));

    it("should automatically enter timestamp", inject(function (keyboard, largeDisplay) {
        // given
        keyboard.trigger('1');
        keyboard.trigger('ÄND');
        keyboard.triggerMany('123456');
        keyboard.trigger('⏎');
        keyboard.trigger('SLT');

        // when
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('ÄND');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('123456*FR:      ');
    }));
});