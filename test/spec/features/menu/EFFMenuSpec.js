'use strict';

require('../../../TestHelper');

describe("EFF", function() {

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

    it('should start with LÅG', inject(function (keyboard, smallDisplay) {
        keyboard.trigger('EFF');

        // then
        expect(smallDisplay.toString()).toEqual('EFF:LÅG ');
    }));

    it('can change to NRM', inject(function (keyboard, smallDisplay) {
        keyboard.trigger('EFF');
        keyboard.trigger('ÄND');

        // then
        expect(smallDisplay.toString()).toEqual('EFF:NRM ');
    }));

    it('should be limited to LÅG and NRM when not on high voltage', inject(function (keyboard, smallDisplay) {
        keyboard.trigger('EFF');
        keyboard.trigger('ÄND');
        keyboard.trigger('ÄND');

        // then
        expect(smallDisplay.toString()).not.toEqual('EFF:HÖG ');
    }));

    it('should allow HÖG when on high voltage', inject(function (keyboard, smallDisplay, eff) {
        // given
        eff.hasHighVoltage(true);

        // when
        keyboard.trigger('EFF');
        keyboard.trigger('ÄND');
        keyboard.trigger('ÄND');

        // then
        expect(smallDisplay.toString()).toEqual('EFF:HÖG ');
    }));

    it('should default to LÅG when high voltage is disabled', inject(function (keyboard, smallDisplay, eff) {
        // given
        eff.hasHighVoltage(true);
        eff.set('HÖG');

        // when
        eff.hasHighVoltage(false);
        keyboard.trigger('EFF');

        // then
        expect(smallDisplay.toString()).toEqual('EFF:LÅG ');
    }));
});