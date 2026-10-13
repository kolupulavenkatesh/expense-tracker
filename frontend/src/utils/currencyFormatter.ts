/**
 * Formats a numeric value into a localized currency string.
 * @param amount - The numerical amount to format.
 * @param currency - The currency code (default: USD).
 * @param locale - The locale string (default: en-US).
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount == null || isNaN(amount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
