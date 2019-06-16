/* eslint-disable react/prop-types */

const React = require('react');
const ReactDOM = require('react-dom');
const { act } = require('react-dom/test-utils');
const useOutsideEvent = require('../use-outside-event.js');

function App({ eventHandler, eventName, flipRef }) {
    const wrapper = React.useRef(null);
    const target = React.useRef(null);
    useOutsideEvent(flipRef ? wrapper : target, eventName, eventHandler);
    return (
        <div id="wrapper" ref={wrapper}>
            <div id="target" ref={target}>
                <div id="inner">pants</div>
            </div>
        </div>
    );
}

describe('useOutsideEvent', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
        container = null;
    });

    it('should invoke the callback when the event occurs on an element outside the target element', () => {
        const callback = jest.fn();
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="click" />,
                container
            );
        });
        const event = new MouseEvent('click', { bubbles: true });
        expect(callback).toHaveBeenCalledTimes(0);
        act(() => {
            container.querySelector('#wrapper').dispatchEvent(event);
        });
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(event);
    });

    it('should not invoke the callback when the event occurs on the target element or any of its children', () => {
        const callback = jest.fn();
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="click" />,
                container
            );
        });
        const target = container.querySelector('#target');
        const inner = container.querySelector('#inner');
        act(() => {
            target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(callback).toHaveBeenCalledTimes(0);
        act(() => {
            inner.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should remove prior event listeners if ref changes', () => {
        const callback = jest.fn();
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="mousemove" />,
                container
            );
        });
        const wrapper = container.querySelector('#wrapper');
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="mousemove" flipRef />,
                container
            );
        });
        expect(wrapper).toBe(container.querySelector('#wrapper'));
        act(() => {
            wrapper.dispatchEvent(
                new MouseEvent('mousemove', { bubbles: true })
            );
        });
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should remove prior event listeners if event name changes', () => {
        const callback = jest.fn(event => expect(event.type).toBe('mouseout'));
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="mousemove" />,
                container
            );
        });
        const wrapper = container.querySelector('#wrapper');
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="mouseout" />,
                container
            );
        });
        expect(wrapper).toBe(container.querySelector('#wrapper'));
        act(() => {
            wrapper.dispatchEvent(
                new MouseEvent('mousemove', { bubbles: true })
            );
            wrapper.dispatchEvent(
                new MouseEvent('mouseout', { bubbles: true })
            );
        });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should remove prior event listeners if event handler changes', () => {
        const originalCallback = jest.fn();
        const newCallback = jest.fn();
        act(() => {
            ReactDOM.render(
                <App eventHandler={originalCallback} eventName="mousemove" />,
                container
            );
        });
        const wrapper = container.querySelector('#wrapper');
        act(() => {
            ReactDOM.render(
                <App eventHandler={newCallback} eventName="mousemove" />,
                container
            );
        });
        expect(wrapper).toBe(container.querySelector('#wrapper'));
        act(() => {
            wrapper.dispatchEvent(
                new MouseEvent('mousemove', { bubbles: true })
            );
        });
        expect(originalCallback).toHaveBeenCalledTimes(0);
        expect(newCallback).toHaveBeenCalledTimes(1);
    });

    it("should not do anything on re-render if input params don't change", () => {
        jest.spyOn(document, 'addEventListener');
        const callback = jest.fn();
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="click" />,
                container
            );
        });
        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        act(() => {
            ReactDOM.render(
                <App eventHandler={callback} eventName="click" />,
                container
            );
        });
        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        document.addEventListener.mockClear();
    });

    it('should clean up event listeners after component has been unmounted', () => {
        act(() => {
            ReactDOM.render(
                <App eventHandler={() => {}} eventName="click" />,
                container
            );
        });
        // We have to do this because `ref.current` will be `null` after unmount, so the
        // callback won't be invoked even if we forget to remove the listener.
        jest.spyOn(document, 'removeEventListener');
        ReactDOM.unmountComponentAtNode(container);
        act(() => {
            document.body.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });
        expect(document.removeEventListener).toHaveBeenCalledTimes(1);
        document.removeEventListener.mockClear();
    });
});
