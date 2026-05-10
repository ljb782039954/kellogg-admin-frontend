# adminApp生产环境：

## 图片管理- 点击图片网格中的图片

直接白屏，控制台日志

react-dom_client.js?v=b9aaffaf:4598 Uncaught Error: Objects are not valid as a React child (found: object with keys {zh, en}). If you meant to render a collection of children, use an array instead.
at throwOnInvalidObjectTypeImpl (react-dom_client.js?v=b9aaffaf:4598:15)
at throwOnInvalidObjectType (react-dom_client.js?v=b9aaffaf:4606:13)
at reconcileChildFibersImpl (react-dom_client.js?v=b9aaffaf:5217:13)
at react-dom_client.js?v=b9aaffaf:5237:35
at reconcileChildren (react-dom_client.js?v=b9aaffaf:7182:53)
at beginWork (react-dom_client.js?v=b9aaffaf:8701:104)
at runWithFiberInDEV (react-dom_client.js?v=b9aaffaf:997:72)
at performUnitOfWork (react-dom_client.js?v=b9aaffaf:12561:98)
at workLoopSync (react-dom_client.js?v=b9aaffaf:12424:43)
at renderRootSync (react-dom_client.js?v=b9aaffaf:12408:13)
throwOnInvalidObjectTypeImpl @ react-dom_client.js?v=b9aaffaf:4598
throwOnInvalidObjectType @ react-dom_client.js?v=b9aaffaf:4606
reconcileChildFibersImpl @ react-dom_client.js?v=b9aaffaf:5217
(anonymous) @ react-dom_client.js?v=b9aaffaf:5237
reconcileChildren @ react-dom_client.js?v=b9aaffaf:7182
beginWork @ react-dom_client.js?v=b9aaffaf:8701
runWithFiberInDEV @ react-dom_client.js?v=b9aaffaf:997
performUnitOfWork @ react-dom_client.js?v=b9aaffaf:12561
workLoopSync @ react-dom_client.js?v=b9aaffaf:12424
renderRootSync @ react-dom_client.js?v=b9aaffaf:12408
performWorkOnRoot @ react-dom_client.js?v=b9aaffaf:11827
performSyncWorkOnRoot @ react-dom_client.js?v=b9aaffaf:13517
flushSyncWorkAcrossRoots_impl @ react-dom_client.js?v=b9aaffaf:13414
processRootScheduleInMicrotask @ react-dom_client.js?v=b9aaffaf:13437
(anonymous) @ react-dom_client.js?v=b9aaffaf:13531
<span>
exports.jsxDEV @ react_jsx-dev-runtime.js?v=b9aaffaf:247
$RefreshSig$ @ MediaDetails.tsx:79
$RefreshSig$ @ MediaDetails.tsx:74
react_stack_bottom_frame @ react-dom_client.js?v=b9aaffaf:18509
renderWithHooksAgain @ react-dom_client.js?v=b9aaffaf:5729
renderWithHooks @ react-dom_client.js?v=b9aaffaf:5665
updateFunctionComponent @ react-dom_client.js?v=b9aaffaf:7475
beginWork @ react-dom_client.js?v=b9aaffaf:8525
runWithFiberInDEV @ react-dom_client.js?v=b9aaffaf:997
performUnitOfWork @ react-dom_client.js?v=b9aaffaf:12561
workLoopSync @ react-dom_client.js?v=b9aaffaf:12424
renderRootSync @ react-dom_client.js?v=b9aaffaf:12408
performWorkOnRoot @ react-dom_client.js?v=b9aaffaf:11827
performSyncWorkOnRoot @ react-dom_client.js?v=b9aaffaf:13517
flushSyncWorkAcrossRoots_impl @ react-dom_client.js?v=b9aaffaf:13414
processRootScheduleInMicrotask @ react-dom_client.js?v=b9aaffaf:13437
(anonymous) @ react-dom_client.js?v=b9aaffaf:13531
MediaDetails.tsx:79 An error occurred in the <span> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

defaultOnUncaughtError @ react-dom_client.js?v=b9aaffaf:6966
logUncaughtError @ react-dom_client.js?v=b9aaffaf:7020
runWithFiberInDEV @ react-dom_client.js?v=b9aaffaf:997
lane.callback @ react-dom_client.js?v=b9aaffaf:7048
callCallback @ react-dom_client.js?v=b9aaffaf:5491
commitCallbacks @ react-dom_client.js?v=b9aaffaf:5503
runWithFiberInDEV @ react-dom_client.js?v=b9aaffaf:999
commitLayoutEffectOnFiber @ react-dom_client.js?v=b9aaffaf:9976
flushLayoutEffects @ react-dom_client.js?v=b9aaffaf:12924
commitRoot @ react-dom_client.js?v=b9aaffaf:12803
commitRootWhenReady @ react-dom_client.js?v=b9aaffaf:12016
performWorkOnRoot @ react-dom_client.js?v=b9aaffaf:11950
performSyncWorkOnRoot @ react-dom_client.js?v=b9aaffaf:13517
flushSyncWorkAcrossRoots_impl @ react-dom_client.js?v=b9aaffaf:13414
processRootScheduleInMicrotask @ react-dom_client.js?v=b9aaffaf:13437
(anonymous) @ react-dom_client.js?v=b9aaffaf:13531
<span>
exports.jsxDEV @ react_jsx-dev-runtime.js?v=b9aaffaf:247
$RefreshSig$ @ MediaDetails.tsx:79
$RefreshSig$ @ MediaDetails.tsx:74
react_stack_bottom_frame @ react-dom_client.js?v=b9aaffaf:18509
renderWithHooksAgain @ react-dom_client.js?v=b9aaffaf:5729
renderWithHooks @ react-dom_client.js?v=b9aaffaf:5665
updateFunctionComponent @ react-dom_client.js?v=b9aaffaf:7475
beginWork @ react-dom_client.js?v=b9aaffaf:8525
runWithFiberInDEV @ react-dom_client.js?v=b9aaffaf:997
performUnitOfWork @ react-dom_client.js?v=b9aaffaf:12561
workLoopSync @ react-dom_client.js?v=b9aaffaf:12424
renderRootSync @ react-dom_client.js?v=b9aaffaf:12408
performWorkOnRoot @ react-dom_client.js?v=b9aaffaf:11827
performSyncWorkOnRoot @ react-dom_client.js?v=b9aaffaf:13517
flushSyncWorkAcrossRoots_impl @ react-dom_client.js?v=b9aaffaf:13414
processRootScheduleInMicrotask @ react-dom_client.js?v=b9aaffaf:13437
(anonymous) @ react-dom_client.js?v=b9aaffaf:13531
