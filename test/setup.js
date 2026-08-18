// Shims the handful of jasmine globals the specs use onto vitest.
// Cheaper than rewriting 25 spec files.
import { vi, afterEach } from 'vitest';

// jasmine spies carry .and / .calls helpers; vitest mocks don't.
function jasminify(spy) {
    spy.and = {
        callThrough: function () { return spy; },
        returnValue: function (v) { spy.mockReturnValue(v); return spy; },
        callFake: function (fn) { spy.mockImplementation(fn); return spy; },
    };
    spy.calls = {
        reset: function () { spy.mockClear(); },
        count: function () { return spy.mock.calls.length; },
        mostRecent: function () {
            var calls = spy.mock.calls;
            return { args: calls[calls.length - 1] };
        },
        all: function () {
            return spy.mock.calls.map(function (args) { return { args: args }; });
        },
    };
    return spy;
}

globalThis.jasmine = {
    clock: function () {
        return {
            install: function () {
                vi.useFakeTimers();
                return this;
            },
            uninstall: function () {
                vi.useRealTimers();
            },
            mockDate: function (date) {
                vi.setSystemTime(date);
                return this;
            },
            tick: function (ms) {
                vi.advanceTimersByTime(ms);
            },
        };
    },
    createSpy: function (name) {
        return jasminify(vi.fn().mockName(name || 'spy'));
    },
};

globalThis.spyOn = function (object, method) {
    return jasminify(vi.spyOn(object, method));
};

afterEach(function () {
    vi.useRealTimers();
});
