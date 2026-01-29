/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Locale } from "date-fns"
import { format as dateFnsFormat } from "date-fns"
import { enUS, it } from "date-fns/locale"
import type i18next from "i18next"

const localesMap: Record<string, Locale> = {
  it,
  en: enUS,
}

function getLocale(lng?: string) {
  return localesMap[lng ?? "en"] ?? enUS
}

/**
 * Adds custom formatters to i18next for date formatting.
 * Uses date-fns to extend i18next capabilities for custom date formats.
 *
 * @see {@link https://www.i18next.com/translation-function/formatting | i18next formatting}
 * @see {@link https://date-fns.org/docs/format | date-fns format}
 */
export function addCustomFormatters(i18n: typeof i18next) {
  // Add custom date formatter
  i18n.services.formatter?.add("dateFormat", (value, lng, options) => {
    const date = value instanceof Date ? value : new Date(value)
    const formatStr = (options.format as string | undefined) ?? "P" // Default to localized date
    return dateFnsFormat(date, formatStr, { locale: getLocale(lng) })
  })

  // Add ISO date formatter (yyyy-MM-dd)
  i18n.services.formatter?.add("isoDate", value => {
    const date = value instanceof Date ? value : new Date(value)
    return date.toISOString().split("T")[0]
  })

  // Add short date formatter (localized)
  i18n.services.formatter?.add("shortDate", (value, lng) => {
    const date = value instanceof Date ? value : new Date(value)
    return dateFnsFormat(date, "P", { locale: getLocale(lng) })
  })

  // Add long date formatter (localized with weekday)
  i18n.services.formatter?.add("longDate", (value, lng) => {
    const date = value instanceof Date ? value : new Date(value)
    return dateFnsFormat(date, "PPP", { locale: getLocale(lng) })
  })

  // Add date-time formatter (localized)
  i18n.services.formatter?.add("dateTime", (value, lng) => {
    const date = value instanceof Date ? value : new Date(value)
    return dateFnsFormat(date, "Pp", { locale: getLocale(lng) })
  })
}
