'use strict';

require('../../TestHelper');

describe('Tid', function () {

    beforeEach(bootstrapDart380());

    beforeEach(inject(function (mod, selfTest, eventBus) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY); // TEST OK
        jasmine.clock().tick(selfTest.DELAY); // NOLLST
        jasmine.clock().tick(selfTest.DELAY); // (empty)
    }));

    it('should show menu name as last item', inject(function(keyboard, smallDisplay) {

        // when
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');

        // then
        expect(smallDisplay.get()).toBe('  (TID) ');
    }));

    it('should close menu after last item', inject(function(keyboard, smallDisplay, tidMenu) {

        // when
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');

        // then
        expect(smallDisplay.get()).toBe('');
        expect(tidMenu.isOpen()).toBe(false);
    }));

    it('should close menu on SLT', inject(function(keyboard, smallDisplay, tidMenu) {

        // when
        keyboard.trigger('1');
        keyboard.trigger('SLT');

        // then
        expect(smallDisplay.get()).toBe('');
        expect(tidMenu.isOpen()).toBe(false);
    }));

    describe('T', function () {
        beforeEach(inject(function(keyboard) {
            keyboard.trigger('1');
        }));

        it('should open T: menu', inject(function(keyboard, smallDisplay) {
            // then
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        describe('editing', function () {

            beforeEach(inject(function(keyboard) {
                keyboard.trigger('ÄND');
            }));

            it('should clear value', inject(function(smallDisplay) {
                // then
                expect(smallDisplay.get()).toBe('T:');
            }));

            it('should show cursor', inject(function(smallDisplay) {
                // then
                expect(smallDisplay.getCursor()).toBe(2);
            }));

            it('should write input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');

                // then
                expect(smallDisplay.get()).toBe('T:2');
            }));

            it('should move cursor with input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');

                // then
                expect(smallDisplay.getCursor()).toBe(3);
            }));

            it('should write input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');

                // then
                expect(smallDisplay.get()).toBe('T:2');
            }));

            it('should stop cursor at last character', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');
                keyboard.trigger('1');
                keyboard.trigger('2');
                keyboard.trigger('5');
                keyboard.trigger('4');
                keyboard.trigger('7');

                // then
                expect(smallDisplay.getCursor()).toBe(7);
            }));

            it('should cancel edit on SLT', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.triggerMany('235959');
                keyboard.trigger('SLT');

                // then
                expect(smallDisplay.get()).toBe('T:000000');
            }));

            it('should reject incomplete input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.triggerMany('24000');
                keyboard.trigger('⏎');

                // then
                expect(smallDisplay.toString()).toBe('T:      ');
                expect(smallDisplay.getCursor()).toBe(2);
            }));

            it('should reject more than 23 hours', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.triggerMany('240000');
                keyboard.trigger('⏎');

                // then
                expect(smallDisplay.toString()).toBe('T:      ');
                expect(smallDisplay.getCursor()).toBe(2);
            }));

            it('should reject more than 59 minutes', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.triggerMany('236000');
                keyboard.trigger('⏎');

                // then
                expect(smallDisplay.toString()).toBe('T:      ');
                expect(smallDisplay.getCursor()).toBe(2);
            }));

            it('should reject more than 59 seconds', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.triggerMany('235960');
                keyboard.trigger('⏎');

                // then
                expect(smallDisplay.toString()).toBe('T:      ');
                expect(smallDisplay.getCursor()).toBe(2);
            }));
        });
    });

    describe('DAT', function () {
        beforeEach(inject(function(keyboard) {
            keyboard.trigger('1');
            keyboard.trigger('⏎');
        }));

        it('should open DAT: menu', inject(function(keyboard, smallDisplay) {
            // then
            expect(smallDisplay.get()).toBe('DAT:0101');
        }));

        it('should reject incomplete input', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('010');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject zero month', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0001');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject zero day', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0100');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 12 months', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1301');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in January', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0132');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 28 days in February', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0229');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in March', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0332');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 30 days in April', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0431');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in May', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0532');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 30 days in June', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0631');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in July', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0732');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in August', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0832');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 30 days in September', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0931');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in October', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1032');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 30 days in November', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1131');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));

        it('should reject more than 31 days in December', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1232');
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.toString()).toBe('DAT:    ');
            expect(smallDisplay.getCursor()).toBe(4);
        }));
    });

    describe('time and date boundaries', function () {

        it('should be 1000 milliseconds per second', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            jasmine.clock().tick(999);
            expect(smallDisplay.get()).toBe('T:000000');
            jasmine.clock().tick(1);
            expect(smallDisplay.get()).toBe('T:000001');
        }));

        it('should be 59 seconds per minute', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('000059');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('T:000100');
        }));

        it('should be 59 minutes per hour', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('005959');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('T:010000');
        }));

        it('should have 24 hours per day', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0102');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in January', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0131');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0201');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 28 days in February', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0228');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0301');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in March', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0331');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0401');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in April', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0430');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0501');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in May', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0531');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0601');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in June', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0630');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0701');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in July', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0731');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0801');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in August', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0831');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0901');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in September', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0930');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:1001');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in October', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1031');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:1101');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in November', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1130');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:1201');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in December', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1231');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0101');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));
    });

    describe("TID", function () {
        it("should navigate TID", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            expect(smallDisplay.toString()).toBe("T:000000");
            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("DAT:0101");
            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("  (TID) ");
            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("        ");

            keyboard.trigger('1');
            expect(smallDisplay.toString()).toBe("T:000000");
            keyboard.trigger('SLT');
            expect(smallDisplay.toString()).toBe("        ");

            keyboard.trigger('1');
            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("DAT:0101");
            keyboard.trigger('SLT');
            expect(smallDisplay.toString()).toBe("        ");

            keyboard.trigger('1');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("  (TID) ");
            keyboard.trigger('SLT');
            expect(smallDisplay.toString()).toBe("        ");
        }));

        it("should modify T", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            expect(smallDisplay.toString()).toBe("T:      ");

            keyboard.trigger('2');
            expect(smallDisplay.toString()).toBe("T:2     ");

            keyboard.trigger('0');
            expect(smallDisplay.toString()).toBe("T:20    ");

            keyboard.trigger('3');
            expect(smallDisplay.toString()).toBe("T:203   ");

            keyboard.trigger('4');
            expect(smallDisplay.toString()).toBe("T:2034  ");

            keyboard.trigger('5');
            expect(smallDisplay.toString()).toBe("T:20345 ");

            keyboard.trigger('6');
            expect(smallDisplay.toString()).toBe("T:203456");

            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("T:203456");
        }));

        it("should persist T", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.trigger('1');
            keyboard.trigger('9');
            keyboard.trigger('2');
            keyboard.trigger('8');
            keyboard.trigger('3');
            keyboard.trigger('7');
            keyboard.trigger('⏎');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.toString()).toBe("T:192837");
        }));

        it("should abort input on SLT", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.trigger('1');
            keyboard.trigger('9');
            keyboard.trigger('2');
            keyboard.trigger('SLT');
            expect(smallDisplay.toString()).toBe("T:000000");
        }));

        it("should modify DAT", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            expect(smallDisplay.toString()).toBe("DAT:    ");

            keyboard.trigger('0');
            expect(smallDisplay.toString()).toBe("DAT:0   ");

            keyboard.trigger('9');
            expect(smallDisplay.toString()).toBe("DAT:09  ");

            keyboard.trigger('2');
            expect(smallDisplay.toString()).toBe("DAT:092 ");

            keyboard.trigger('8');
            expect(smallDisplay.toString()).toBe("DAT:0928");

            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("DAT:0928");
        }));

        it("should abort input of DAT", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.trigger('1');
            keyboard.trigger('2');
            keyboard.trigger('3');
            keyboard.trigger('1');
            keyboard.trigger('SLT');
            expect(smallDisplay.toString()).toBe("DAT:0101");
        }));

        it("should persist DAT", inject(function (keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.trigger('1');
            keyboard.trigger('2');
            keyboard.trigger('3');
            keyboard.trigger('1');
            keyboard.trigger('⏎');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            keyboard.trigger('⏎');
            expect(smallDisplay.toString()).toBe("DAT:1231");
        }));
    });
});
