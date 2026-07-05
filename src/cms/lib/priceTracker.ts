// import { $currency, $rates, updateAllPrices } from "./currency";

// /**
//  * 鍒濆鍖栧叏灞€浠锋牸杩借釜鍣?(浠呭湪瀹㈡埛绔繍琛?
//  */
// export function initPriceTracker() {
//   if (typeof window === 'undefined') return;

//   // 1. 鍒濆鍖栨眹鐜?(浠?window.__EXCHANGE_RATES__ 鍚屾)
//   if (window.__EXCHANGE_RATES__) {
//     $rates.set(window.__EXCHANGE_RATES__);
//   }

//   // 2. 鐩戝惉甯佺鍙樺寲骞舵洿鏂版墍鏈夋爣璁扮殑浠锋牸鍏冪礌
//   $currency.subscribe(cur => {
//     updateAllPrices($rates.get(), cur);
//   });

//   // 3. 鐩戝惉姹囩巼鍙樺寲 (闃叉姹囩巼鍔ㄦ€佸姞杞藉欢杩?
//   $rates.subscribe(rates => {
//     updateAllPrices(rates, $currency.get());
//   });

//   // 4. 鐩戝惉鑷畾涔変簨浠?(澶勭悊涓嶅悓 Island 闂寸殑閫氫俊)
//   window.addEventListener('currency-change', (e: any) => {
//     updateAllPrices($rates.get(), e.detail);
//   });
// }
