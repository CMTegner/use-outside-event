var React = require('react');

function useOutsideEvent(ref, eventName, eventHandler) {
    React.useEffect(
        function() {
            function listener(event) {
                if (
                    ref.current &&
                    ref.current !== event.target &&
                    !ref.current.contains(event.target)
                ) {
                    eventHandler(event);
                }
            }
            document.addEventListener(eventName, listener, false);
            return function() {
                document.removeEventListener(eventName, listener, false);
            };
        },
        [ref, eventName, eventHandler]
    );
}

module.exports = useOutsideEvent;
