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

            it('radera blinkande tecken', inject(function (keyboard, smallDisplay) {
                keyboard.trigger('4');
                keyboard.trigger('ÄND');

                keyboard.triggerMany('123');
                keyboard.trigger('DEL');

                expect(smallDisplay.toString()).toBe('FR:123  ');
                expect(smallDisplay.getCursor()).toEqual(5);
                expect(smallDisplay.getBlinking()).toEqual(5);

                keyboard.trigger('DEL');

                expect(smallDisplay.toString()).toBe('FR:12   ');
                expect(smallDisplay.getCursor()).toEqual(4);
                expect(smallDisplay.getBlinking()).toEqual(4);
            }));

            it('cannot delete nothing', inject(function (keyboard, smallDisplay) {
                keyboard.trigger('4');
                keyboard.trigger('ÄND');
                keyboard.trigger('DEL');
                keyboard.triggerMany('1');

                expect(smallDisplay.toString()).toBe('FR:1    ');
                expect(smallDisplay.getCursor()).toEqual(4);
                expect(smallDisplay.getBlinking()).toEqual(4);
            }));

            it('radera blinkande tecken i flerradig funktion', inject(function (keyboard, largeDisplay) {
                keyboard.trigger('FMT');
                keyboard.triggerMany('100');
                keyboard.trigger('⏎');
                keyboard.trigger('⏎');
                keyboard.trigger('ÄND');

                keyboard.triggerMany('CR1');
                keyboard.trigger('DEL');

                expect(largeDisplay.toString()).toBe('TILL:CR1        ');
                expect(largeDisplay.getCursor()).toEqual(7);
                expect(largeDisplay.getBlinking()).toEqual(7);

                keyboard.trigger('DEL');

                expect(largeDisplay.toString()).toBe('TILL:CR         ');
                expect(largeDisplay.getCursor()).toEqual(6);
                expect(largeDisplay.getBlinking()).toEqual(6);
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

    describe('Tändning och släckning', function () {
        describe('vid inmatning', function () {
            beforeEach(inject(function (keyboard) {
                keyboard.trigger('4');
                keyboard.trigger('ÄND');
            }));

            it('släcks INTE teckenfönstret efter 59 s', inject(function (keyboard, smallDisplay) {
                // when
                jasmine.clock().tick(59 * 1000);

                // then
                expect(smallDisplay.toString().trim()).not.toEqual('');
            }));

            it('släcks teckenfönstret efter 60 s', inject(function (keyboard, smallDisplay) {
                // when
                jasmine.clock().tick(60 * 1000);

                // then
                expect(smallDisplay.toString().trim()).toEqual('');
            }));

            it('släcks INTE teckenfönstret efter 59 s efter senaste inmatning', inject(function (keyboard, smallDisplay) {
                // when
                jasmine.clock().tick(30 * 1000);
                keyboard.trigger('0');
                jasmine.clock().tick(59 * 1000);

                // then
                expect(smallDisplay.toString().trim()).not.toEqual('');
            }));

            it('släcks teckenfönstret efter 60 s efter senaste inmatning', inject(function (keyboard, smallDisplay) {
                // when
                jasmine.clock().tick(30 * 1000);
                keyboard.trigger('0');
                jasmine.clock().tick(60 * 1000);

                // then
                expect(smallDisplay.toString().trim()).toEqual('');
            }));

            it('obekräftade tecken raderas efter 60 + 5 s', inject(function (keyboard, smallDisplay) {
                // given
                keyboard.triggerMany('45123');

                // when
                jasmine.clock().tick(65 * 1000);

                // then
                keyboard.trigger('4');
                expect(smallDisplay.toString().trim()).toEqual('FR:30025');
            }));

            it('tänds teckenfönstret om valfri tangent trycks inom ytterliggare 5 s efter nedsläckning', inject(function (keyboard, smallDisplay) {
                // when
                jasmine.clock().tick(60 * 1000);
                jasmine.clock().tick(4 * 1000);
                keyboard.trigger('0');

                // then
                expect(smallDisplay.toString().trim()).toEqual('FR:');
            }));

            it('avslutas funktionen efter ytterliggare 5 s', inject(function (keyboard, menu) {
                // when
                jasmine.clock().tick(60 * 1000);
                jasmine.clock().tick(5 * 1000);

                // then
                expect(menu.isOpenChild()).toBe(false);
            }));
        });

        describe('vid avläsning', function () {
            describe('enradiga funktioner', function () {
                beforeEach(inject(function (keyboard) {
                    keyboard.trigger('4');
                }));

                it('släcks teckenfönstret efter 30 s', inject(function (keyboard, smallDisplay) {
                    // when
                    jasmine.clock().tick(30 * 1000);

                    // then
                    expect(smallDisplay.toString().trim()).toEqual('');
                }));

                it('släcks INTE teckenfönstret efter 29 s', inject(function (keyboard, smallDisplay) {
                    // when
                    jasmine.clock().tick(29 * 1000);

                    // then
                    expect(smallDisplay.toString().trim()).not.toEqual('');
                }));

                it('avslutas funktionen efter 30 s', inject(function (keyboard, menu) {
                    // when
                    jasmine.clock().tick(30 * 1000);

                    // then
                    expect(menu.isOpenChild()).toBe(false);
                }));
            });

            describe('flerradiga funktioner', function () {
                beforeEach(inject(function (keyboard) {
                    keyboard.trigger('FMT');
                    keyboard.triggerMany('100');
                    keyboard.trigger('⏎');
                    keyboard.trigger('SLT');

                    keyboard.trigger('ISK');
                }));

                it('släcks teckenfönstret efter 30 s', inject(function (keyboard, smallDisplay, largeDisplay) {
                    // when
                    jasmine.clock().tick(30 * 1000);

                    // then
                    expect(largeDisplay.toString().trim()).toEqual('');
                    expect(smallDisplay.toString().trim()).toEqual('');
                }));

                it('släcks INTE teckenfönstret efter 29 s', inject(function (keyboard, smallDisplay, largeDisplay) {
                    // when
                    jasmine.clock().tick(29 * 1000);

                    // then
                    expect(largeDisplay.toString().trim()).not.toEqual('');
                    expect(smallDisplay.toString().trim()).not.toEqual('');
                }));

                it('avslutas INTE funktionen om tangent trycks inom 5 s efter nedsläckning', inject(function (keyboard, smallDisplay, largeDisplay) {
                    // when
                    jasmine.clock().tick(30 * 1000);
                    jasmine.clock().tick(4 * 1000);
                    keyboard.trigger('0');

                    // then
                    expect(largeDisplay.toString()).toEqual('000000*FR:      ');
                    expect(smallDisplay.toString()).toEqual('FRI*TEXT');
                }));

                it('avslutas funktionen med 5 s fördröjning efter 30 s', inject(function (keyboard, menu) {
                    // when
                    jasmine.clock().tick(30 * 1000);
                    jasmine.clock().tick(5 * 1000);

                    // then
                    expect(menu.isOpenChild()).toBe(false);
                }));
            });
        });
    });
});