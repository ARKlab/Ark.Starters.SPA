export const getLocale = (): string | undefined => {
    const browserLocales =
    navigator.languages === undefined
      ? navigator.language
      : navigator.languages[0];

      if(!browserLocales)
        return "en";

    return browserLocales;
}

export const getDecimalFormatter = (locale?: string): Intl.NumberFormat | null => {

  let numberLocale = locale ?? getLocale();

  return numberLocale != null ? 
  new Intl.NumberFormat(numberLocale, { useGrouping: false })
  : null 
}

export const getCurrencyFormatter = (locale?: string): Intl.NumberFormat | null => {

  let numberLocale = locale ?? getLocale();
  
  return numberLocale != null ? 
  new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false })
  : null 
}

export const formatNumber = (num: number | null | undefined, formatter: Intl.NumberFormat | null): string => {

  if(num == null || num === undefined || formatter == null)
    return "";

  return formatter?.format(num);
}


export const CurrencyFormatter = getCurrencyFormatter();
export const DecimalFormatter = getDecimalFormatter();

