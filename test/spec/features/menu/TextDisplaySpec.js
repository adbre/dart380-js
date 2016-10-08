'use strict';

require('../../../TestHelper');

describe("Teckenfönster (Ra180/480 instruktionsbok utdrag) s.12", function() {

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

    describe('Presentation av text', function () {
        it('text som operatören inte kan ändra', inject(function (keyboard, smallDisplay) {
            keyboard.trigger('DDA'); // AD:*
            keyboard.trigger('⏎');   // SKR:
            keyboard.trigger('⏎');   // OPMTN:
            keyboard.trigger('⏎');   // SUM:
            keyboard.trigger('⏎');   // TKL:
            keyboard.trigger('⏎');   // BAT=

            expect(smallDisplay.toString()).toMatch(/^BAT=[0-9]+\.[0-9]+$/);
            expect(smallDisplay.getCursor()).toEqual(-1);
            expect(smallDisplay.getBlinking()).toEqual(-1);
        }));

        describe('text (inställningar) med ett fast kolon som skiljetecken', function () {
            it('fast kolon som skiljetecken', inject(function (keyboard, smallDisplay) {
                keyboard.trigger('4');

                expect(smallDisplay.toString()).toMatch(/^FR:[0-9]{5}$/);
                expect(smallDisplay.getCursor()).toEqual(-1);
                expect(smallDisplay.getBlinking()).toEqual(-1);
            }));

            it('operatören måste trycka på knappen ÄND för att kunna mata in nytt värde', inject(function (keyboard, smallDisplay) {
                keyboard.trigger('4');
                keyboard.trigger('ÄND');

                expect(smallDisplay.toString()).toBe('FR:     ');
                expect(smallDisplay.getCursor()).toEqual(3);
                expect(smallDisplay.getBlinking()).toEqual(3);
            }));

            it('en blinkande markör indikerar inmatningsposition', inject(function (keyboard, smallDisplay) {
                keyboard.trigger('4');
                keyboard.trigger('ÄND');

                expect(smallDisplay.toString()).toBe('FR:     ');
                expect(smallDisplay.getCursor()).toEqual(3);
                expect(smallDisplay.getBlinking()).toEqual(3);

                keyboard.triggerMany('123');

                expect(smallDisplay.toString()).toBe('FR:123  ');
                expect(smallDisplay.getCursor()).toEqual(6);
                expect(smallDisplay.getBlinking()).toEqual(6);

                keyboard.triggerMany('45');

                expect(smallDisplay.toString()).toBe('FR:12345');
                expect(smallDisplay.getCursor()).toEqual(7);
                expect(smallDisplay.getBlinking()).toEqual(7);
            }));
        });

        describe('text (inställningar) med ett blinkande kolon som skiljetecken', function () {
            it('blinkande kolon som skiljetecken', inject(function (keyboard, smallDisplay) {
                keyboard.trigger('DDA');
                keyboard.trigger('⏎');

                expect(smallDisplay.toString()).toMatch(/^SKR:.*$/);
                expect(smallDisplay.getCursor()).toEqual(-1);
                expect(smallDisplay.getBlinking()).toEqual(3);
            }));

            it('värdet är valbart och ändras med ÄND', inject(function (keyboard, smallDisplay) {
                // given
                keyboard.trigger('DDA');
                keyboard.trigger('⏎');

                var firstValue = smallDisplay.toString();

                // when
                keyboard.trigger('ÄND');

                // then
                expect(smallDisplay.toString()).not.toEqual(firstValue);
            }));
        });
    });
});