# adminApp生产环境：

## 进入页面管理-页面编辑

react-dom_client.js?v=fb503298:20103 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
PageLayoutEditor.tsx:246 Uncaught TypeError: Cannot read properties of undefined (reading 'zh')
at PageLayoutEditor (PageLayoutEditor.tsx:246:68)
at Object.react_stack_bottom_frame (react-dom_client.js?v=fb503298:18509:20)
at renderWithHooks (react-dom_client.js?v=fb503298:5654:24)
at updateFunctionComponent (react-dom_client.js?v=fb503298:7475:21)
at beginWork (react-dom_client.js?v=fb503298:8525:20)
at runWithFiberInDEV (react-dom_client.js?v=fb503298:997:72)
at performUnitOfWork (react-dom_client.js?v=fb503298:12561:98)
at workLoopSync (react-dom_client.js?v=fb503298:12424:43)
at renderRootSync (react-dom_client.js?v=fb503298:12408:13)
at performWorkOnRoot (react-dom_client.js?v=fb503298:11827:37)
(anonymous) @ PageLayoutEditor.tsx:246
react_stack_bottom_frame @ react-dom_client.js?v=fb503298:18509
renderWithHooks @ react-dom_client.js?v=fb503298:5654
updateFunctionComponent @ react-dom_client.js?v=fb503298:7475
beginWork @ react-dom_client.js?v=fb503298:8525
runWithFiberInDEV @ react-dom_client.js?v=fb503298:997
performUnitOfWork @ react-dom_client.js?v=fb503298:12561
workLoopSync @ react-dom_client.js?v=fb503298:12424
renderRootSync @ react-dom_client.js?v=fb503298:12408
performWorkOnRoot @ react-dom_client.js?v=fb503298:11827
performWorkOnRootViaSchedulerTask @ react-dom_client.js?v=fb503298:13505
performWorkUntilDeadline @ react-dom_client.js?v=fb503298:36
react-dom_client.js?v=fb503298:6966 An error occurred in the <PageLayoutEditor> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

defaultOnUncaughtError @ react-dom_client.js?v=fb503298:6966
logUncaughtError @ react-dom_client.js?v=fb503298:7020
runWithFiberInDEV @ react-dom_client.js?v=fb503298:997
lane.callback @ react-dom_client.js?v=fb503298:7048
callCallback @ react-dom_client.js?v=fb503298:5491
commitCallbacks @ react-dom_client.js?v=fb503298:5503
runWithFiberInDEV @ react-dom_client.js?v=fb503298:999
commitLayoutEffectOnFiber @ react-dom_client.js?v=fb503298:9976
flushLayoutEffects @ react-dom_client.js?v=fb503298:12924
commitRoot @ react-dom_client.js?v=fb503298:12803
commitRootWhenReady @ react-dom_client.js?v=fb503298:12016
performWorkOnRoot @ react-dom_client.js?v=fb503298:11950
performWorkOnRootViaSchedulerTask @ react-dom_client.js?v=fb503298:13505
performWorkUntilDeadline @ react-dom_client.js?v=fb503298:36
