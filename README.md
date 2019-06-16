# use-outside-event [![npm version](https://badge.fury.io/js/use-outside-event.svg)](https://www.npmjs.com/package/use-outside-event) [![Build status](https://travis-ci.org/CMTegner/use-outside-event.svg)](http://travis-ci.org/CMTegner/use-outside-event) [![Coverage Status](https://coveralls.io/repos/github/CMTegner/use-outside-event/badge.svg?branch=master)](https://coveralls.io/github/CMTegner/use-outside-event?branch=master)

A React.js hook which lets you react to DOM events that happen outside a specified element.

## Example

```jsx
import React, { useCallback, useRef, useState } from 'react';
import useOutsideEvent from 'use-outside-event';

function OutsideCounter() {
    const [counter, setCunter] = useState(0);
    const incrementCounter = useCallback(() => setCounter(count => count + 1));
    const ref = useRef(null);
    useOutsideEvent(ref, 'click', incrementCounter);
    return (
        <div ref={ref}>
            Times clicked outside this element: {counter}
        </div>
    );
}
```

[Here's a simple online demo](https://use-outside-event.cmtegner.now.sh) which can be useful if you need to test on a specific browser/device. 

## Installation

```bash
npm install use-outside-event
```

Any other client which points to the central npm registry will work just as well.

## Usage

```javascript
useOutsideEvent(ref, eventName, eventHandler);
```

* `ref` is expected to be the result of calling `React.useRef`
* `eventName` is the name of the desired event to listen for, e.g. "click", "pointerdown", "mousemove", etc.
* `eventHandler` is a function that will be invoked every time an event of type `eventName` occurs on an element which is not contained by or equal to `ref.current`
    * This function will receive the original event as its only argument

## Compatibility

Naturally this hook requires a React.js version with production support for hooks (i.e. 16.8 or greater). The syntax used should be supported by pretty much every browser ever released, but if you need to support IE8 or older you'll need to polyfill [`Node#contains`](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains) and [`EventTarget#addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). Remember that you also need to satisfy [React's own requirements](https://reactjs.org/docs/react-dom.html#browser-support) if you're targeting older browsers.

## FAQ

### Wait, `var` in 2019...?

Heh. I didn't really feel like setting up a transpile step for this simple module, so I just stuck to ES5 syntax to ensure good compatibility.

### What's going on with the flow type definitions?

Due to the no-transpile rule mentioned above, I had to do a reverse approach when creating the flow type definitions. Instead of having the types inline in the source and stripping them during transpilation, I decided to just hand code a separate `.js.flow` typedef. Since this module only exposes a single function I'm not too worried about keeping them in sync.

### Typescript?

I don't use typescript, but I'd be happy to accept a PR if you have the required know-how and can author a solution similar to what's done for flow.

## License

ISC, see `LICENSE.md`.