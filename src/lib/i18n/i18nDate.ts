import type { Locale } from 'date-fns';
import { format as _format } from 'date-fns';
import { enUS, it } from 'date-fns/locale';
import i18next from 'i18next';

const localesMap: Record<string, Locale> = {
  it,
  en: enUS,
}

function getLocale() {
  return localesMap[i18next.resolvedLanguage ?? 'it'] ?? it;
}

/**
 * Formats a date according to the given format string with automatic locale handling.
 * 
 * @see {@link https://date-fns.org/docs/format | date-fns format documentation}
 */
export function format(date: Date | string, formatStr: string) {
  return _format(date, formatStr, { locale: getLocale() })
}

/**
 * Formats a date with automatic locale handling.
 * 
 * @param date - The date to format
 * @param formatStr - The format string (default: "P" - localized date)
 * @see {@link https://date-fns.org/docs/format | date-fns format documentation}
 */
export function formatDate(date: Date | string, formatStr = "P") {
  return format(date, formatStr)
}

/**
 * Formats a date and time with automatic locale handling.
 * 
 * @param date - The date to format
 * @param formatStr - The format string (default: "Pp" - localized date and time)
 * @see {@link https://date-fns.org/docs/format | date-fns format documentation}
 */
export function formatDateTime(date: Date | string, formatStr = "Pp") {
  return format(date, formatStr)
}