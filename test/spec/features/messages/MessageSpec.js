'use strict';

var _ = require('lodash');

require('../../../TestHelper');

describe("Message", function() {

    beforeEach(bootstrapDart380());

    describe('backspace (ÄND)', function () {

        it('it should remove previous position', inject(function (messages) {
            // given
            var message = messages.createMessage('100');
            message.writeAt(5, 5, 'ABC');

            // when
            message.backspace(5, 6);

            // then
            expect(message.toString(5)).toEqual('TEXT:BC         ');
        }));

        it('it should move cursor to previous position', inject(function (messages) {
            // given
            var message = messages.createMessage('100');
            message.writeAt(5, 5, 'ABC');

            // when
            var actual = message.backspace(5, 6);

            // then
            expect(actual.row).toBe(5, 'row');
            expect(actual.col).toBe(5, 'col');
        }));


        it('it should NOT move up content in next field', inject(function (messages) {
            // given
            var message = messages.createMessage('100');
            message.setSender('AA');
            message.setTimestamp('123456');

            // when
            message.backspace(2, 1);

            // then
            expect(message.toString(2)).toEqual('23456 *FR:AA    ');
        }));

    });

    describe('delete (DEL)', function () {

        it('it should remove current position', inject(function (messages) {
            // given
            var message = messages.createMessage('100');
            message.writeAt(5, 5, 'ABC');

            // when
            message.delete(5, 6);

            // then
            expect(message.toString(5)).toEqual('TEXT:AC         ');
        }));

        it('it should keep cursor to previous position', inject(function (messages) {
            // given
            var message = messages.createMessage('100');
            message.writeAt(5, 5, 'ABC');

            // when
            var actual = message.delete(5, 6);

            // then
            expect(actual.row).toBe(5, 'row');
            expect(actual.col).toBe(6, 'col');
        }));


        it('it should NOT move up content in next field', inject(function (messages) {
            // given
            var message = messages.createMessage('100');
            message.setSender('AA');
            message.setTimestamp('123456');

            // when
            message.delete(2, 1);

            // then
            expect(message.toString(2)).toEqual('13456 *FR:AA    ');
        }));
    });
});