import i18next from 'i18next';

/**
 * Formats a date using i18n with the specified format options.
 * 
 * @param date - The date to format
 * @param formatOptions - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat | Intl.DateTimeFormat}
 */
export function formatDate(date: Date | string, formatOptions?: Intl.DateTimeFormatOptions): string {
  return i18next.t("date", {
    val: date,
    formatParams: { val: formatOptions ?? {} }
  });
}

/**
 * Formats a date as ISO date string (YYYY-MM-DD) using i18n.
 * 
 * @param date - The date to format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function formatISODate(date: Date | string): string {
  return i18next.t("date", {
    val: date,
    formatParams: { 
      val: { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      } 
    }
  });
}

/**
 * Formats a date as ISO date string (YYYY-MM-DD) using native JavaScript.
 * This is useful for internal date handling and API communication where exact format is required.
 * 
 * @param date - The date to format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date in DD/MM/YYYY or MM/DD/YYYY format based on format string.
 * Uses native JavaScript for compatibility with date pickers and internal components.
 * 
 * @param date - The date to format
 * @param formatString - Format string (e.g., "dd/MM/yyyy" or "MM/dd/yyyy")
 * @returns Formatted date string
 */
export function formatDateString(date: Date, formatString: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return formatString
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
}

/**
 * Formats a date with day, month, and year using i18n.
 * 
 * @param date - The date to format
 * @returns Formatted date string (e.g., "12/31/2024" or "31/12/2024" depending on locale)
 */
export function formatShortDate(date: Date | string): string {
  return i18next.t("date", {
    val: date,
    formatParams: { 
      val: { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      } 
    }
  });
}

/**
 * Formats a date with long format including weekday using i18n.
 * 
 * @param date - The date to format
 * @returns Formatted date string with weekday
 */
export function formatLongDate(date: Date | string): string {
  return i18next.t("date", {
    val: date,
    formatParams: { 
      val: { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      } 
    }
  });
}

/**
 * Formats a date and time using i18n.
 * 
 * @param date - The date to format
 * @param formatOptions - Optional Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string, formatOptions?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  return i18next.t("date", {
    val: date,
    formatParams: { val: formatOptions ?? defaultOptions }
  });
}
