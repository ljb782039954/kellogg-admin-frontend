export function getHydrationSafeRates(
  storeRates: Record<string, number> | null,
  initialRates: Record<string, number> | null,
): Record<string, number> | null {
  return storeRates || initialRates;
}
