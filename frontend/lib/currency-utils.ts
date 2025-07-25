/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a large number with appropriate suffix (K, M, B, T)
 * @param num - The number to format
 * @param digits - Number of decimal places (default: 1)
 * @returns Formatted number string with suffix
 */
export function formatNumberWithSuffix(num: number, digits: number = 1): string {
  if (num < 1000) return num.toString();
  
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  
  const rx = /(\.\d*?[1-9])0+$|(\.0*)?$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  
  return item 
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol 
    : '0';
}

/**
 * Format a percentage value
 * @param value - The value to format (0-1)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Format a price change with sign and color class
 * @param change - The price change value
 * @param isPercentage - Whether the change is a percentage (default: false)
 * @returns Object with formatted value and color class
 */
export function formatPriceChange(
  change: number,
  isPercentage: boolean = false
): { value: string; className: string } {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  const prefix = isPositive ? '+' : '';
  const value = isPercentage 
    ? `${prefix}${change.toFixed(2)}%`
    : `${prefix}${change.toFixed(2)}`;
  
  const className = isNeutral 
    ? 'text-muted-foreground' 
    : isPositive 
      ? 'text-success' 
      : 'text-destructive';
  
  return { value, className };
}

/**
 * Convert a number to a human-readable format with commas
 * @param num - The number to format
 * @returns Formatted number string with commas
 */
export function formatNumberWithCommas(num: number | string): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parse a currency string to a number
 * @param str - The currency string to parse
 * @returns Parsed number or NaN if invalid
 */
export function parseCurrency(str: string): number {
  // Remove all non-numeric characters except decimal point and minus sign
  const numStr = str.replace(/[^0-9.-]+/g, '');
  return parseFloat(numStr);
}
