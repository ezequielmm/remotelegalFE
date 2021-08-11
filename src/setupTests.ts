// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

window.matchMedia = function (query: string) {
    return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    };
};

window.HTMLElement.prototype.scrollIntoView = jest.fn();

class ResizeObserver {
    observe = jest.fn();

    unobserve = jest.fn();

    disconnect = jest.fn();
}

Object.defineProperty(global, "ResizeObserver", {
    writable: true,
    value: ResizeObserver,
});
