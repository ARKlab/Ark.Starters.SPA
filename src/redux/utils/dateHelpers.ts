import { enGB, it } from 'date-fns/esm/locale'
import * as lang from "../../translations/basicTranslationSet";

export const getLocale = (selectedLanguage: string) => {
  if (selectedLanguage === lang.IT)
    return it;

  if (selectedLanguage === lang.EN)
    return enGB;
    
  return enGB;
}