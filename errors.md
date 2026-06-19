react-dom_client.js?v=c78ed604:20103 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
react-dom_client.js?v=c78ed604:3529 Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
getRootForUpdatedFiber @ react-dom_client.js?v=c78ed604:3529
react-dom_client.js?v=c78ed604:3529 Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
getRootForUpdatedFiber @ react-dom_client.js?v=c78ed604:3529
react-dom_client.js?v=c78ed604:3529 Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
getRootForUpdatedFiber @ react-dom_client.js?v=c78ed604:3529
react-dom_client.js?v=c78ed604:3526 Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
    at getRootForUpdatedFiber (react-dom_client.js?v=c78ed604:3526:128)
    at enqueueConcurrentHookUpdate (react-dom_client.js?v=c78ed604:3510:16)
    at dispatchSetStateInternal (react-dom_client.js?v=c78ed604:6832:20)
    at dispatchSetState (react-dom_client.js?v=c78ed604:6803:9)
    at setRef (chunk-HXSAPE4I.js?v=c78ed604:12:12)
    at chunk-HXSAPE4I.js?v=c78ed604:21:23
    at Array.map (<anonymous>)
    at chunk-HXSAPE4I.js?v=c78ed604:20:27
    at setRef (chunk-HXSAPE4I.js?v=c78ed604:12:12)
    at chunk-HXSAPE4I.js?v=c78ed604:21:23
react-dom_client.js?v=c78ed604:6966 An error occurred in the <button> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

defaultOnUncaughtError @ react-dom_client.js?v=c78ed604:6966
