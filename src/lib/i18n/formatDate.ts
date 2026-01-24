import i18next from "i18next"

/**
 * Formats a date using i18n custom formatters.
 * Uses the 'dateFormat' formatter which supports date-fns format strings.
 *
 * @param date - The date to format
 * @param formatString - date-fns format string (default: 'P' - localized date)
 * @returns Formatted date string
 * @see {@link https://date-fns.org/docs/format | date-fns format strings}
 */
export function formatDate(date: Date | string, formatString = "P"): string {
  return i18next.t("{{val, dateFormat}}", { val: date, format: formatString })
}

/**
 * Formats a date as ISO date string (YYYY-MM-DD).
 * Uses the ECMAScript Date.toISOString() method via custom i18n formatter.
 *
 * @param date - The date to format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function formatISODate(date: Date | string): string {
  return i18next.t("{{val, isoDate}}", { val: date })
}

/**
 * Formats a date in DD/MM/YYYY or MM/DD/YYYY format using i18n.
 * For custom format strings needed by date pickers.
 *
 * @param date - The date to format
 * @param formatString - Format string (e.g., "dd/MM/yyyy" or "MM/dd/yyyy")
 * @returns Formatted date string
 */
export function formatDateString(date: Date, formatString: string): string {
  return i18next.t("{{val, dateFormat}}", { val: date, format: formatString })
}

/**
 * Formats a date with day, month, and year using i18n.
 *
 * @param date - The date to format
 * @returns Formatted date string (e.g., "12/31/2024" or "31/12/2024" depending on locale)
 */
export function formatShortDate(date: Date | string): string {
  return i18next.t("{{val, shortDate}}", { val: date })
}

/**
 * Formats a date with long format including weekday using i18n.
 *
 * @param date - The date to format
 * @returns Formatted date string with weekday
 */
export function formatLongDate(date: Date | string): string {
  return i18next.t("{{val, longDate}}", { val: date })
}

/**
 * Formats a date and time using i18n.
 *
 * @param date - The date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  return i18next.t("{{val, dateTime}}", { val: date })
}
