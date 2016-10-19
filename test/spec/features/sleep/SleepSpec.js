'use strict';

require('../../../TestHelper');

describe("sleep", function() {

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

    it('should not attempt to sleep when user has exited the menu himself', inject(function (keyboard) {
        // given
        keyboard.trigger('4');
        keyboard.trigger('SLT');

        // when
        // then
        jasmine.clock().tick(60 * 1000);
    }));

    it('should not attempt to sleep when user has exited edit mode himself', inject(function (keyboard) {
        // given
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('SLT');
        keyboard.trigger('SLT');

        // when
        // then
        jasmine.clock().tick(60 * 1000);
    }));
});