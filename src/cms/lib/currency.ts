// import { atom } from 'nanostores';

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  last_updated: string;
}

export interface CurrencyConfig {
  storageKey?: string;
  defaultCurrency?: string;
}

let currencyConfig: Required<CurrencyConfig> = {
  storageKey: 'site_currency',
  defaultCurrency: 'USD',
};

// export function configureCurrency(config: CurrencyConfig) {
//   currencyConfig = { ...currencyConfig, ...config };
//   if (typeof window !== 'undefined') {
//     const saved = localStorage.getItem(currencyConfig.storageKey);
//     $currency.set(saved || currencyConfig.defaultCurrency);
//   }
// }

export function getCurrencyConfig(): Required<CurrencyConfig> {
  return currencyConfig;
}

export function formatPrice(
  basePrice: number | null | undefined,
  currency: string = currencyConfig.defaultCurrency,
  rates: Record<string, number> | null = null
): string {
  if (basePrice === undefined || basePrice === null) return '';

  if (!rates || !rates[currency]) {
    const fallbackFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CNY',
      currencyDisplay: 'narrowSymbol',
    });
    return `${fallbackFormatter.format(basePrice)} CNY`;
  }

  const targetRate = rates[currency];
  const convertedPrice = basePrice * targetRate;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  });

  const formattedOutput = formatter.format(convertedPrice);

  return `${formattedOutput} ${currency}`;
}

// export const $currency = atom<string>(currencyConfig.defaultCurrency);
// export const $rates = atom<Record<string, number> | null>(null);

// if (typeof window !== 'undefined') {
//   const saved = localStorage.getItem(currencyConfig.storageKey);
//   if (saved) $currency.set(saved);
// }

// export function setGlobalCurrency(cur: string) {
//   $currency.set(cur);
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(currencyConfig.storageKey, cur);
//     window.dispatchEvent(new CustomEvent('currency-change', { detail: cur }));
//   }
// }

export function updateAllPrices(rates: Record<string, number> | null, currency: string) {
  const elements = document.querySelectorAll('[data-base-price]');
  elements.forEach((el) => {
    const basePrice = parseFloat(el.getAttribute('data-base-price') || '0');
    el.textContent = formatPrice(basePrice, currency, rates);
  });
}
