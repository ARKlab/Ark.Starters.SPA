import * as R from "ramda";
import {
  map,
  switchMapTo
} from "rxjs/operators";
import { EMPTY } from "rxjs";
import { ofType, combineEpics, ActionsObservable } from "redux-observable";
import translations from '../../translations.json';
import { Dependancies } from "../storeTypes";
import { flow } from "fp-ts/lib/function";
import * as lang from "../../translations/basicTranslationSet";

export const key = "language";

export const defaultLanguage = lang.IT; //LANG_MOD

const updateLanguageType = "language/SET_LANGUAGE";

export const updateLanguageAction = (language: string) =>
({
  type: updateLanguageType,
  language,
} as const);

type Actions =
  | ReturnType<typeof updateLanguageAction>;

type state = {
  selectedLanguage: string;
  languageList: {
    title: string;
    value: string;
    flag: string;
  }[];
  translations: Record<string, Record<string, string>>;
};

export const initialState = {
  selectedLanguage: defaultLanguage,
  languageList: [
    { title: "English", value: lang.EN, flag: "gb" },
    { title: "Italian", value: lang.IT, flag: "it" }
  ],
  translations
};

type State = typeof initialState;

/************reducer***************************************************************/

export function reducer(
  state: State = initialState,
  action: Actions
): State {
  switch (action.type) {
    case updateLanguageType: {
      return { ...state, selectedLanguage: action.language };
    }
    default:
      return state;
  }
};

/************epic***************************************************************/
export function languageEpic(action$: ActionsObservable<any>,
  _: any,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(updateLanguageType),
    map((language: any) => {
      localStorage.setItem("language", language.language);
      window.location.reload();
    }),
    switchMapTo(EMPTY)
  );
};

export const epic = combineEpics(languageEpic);

/************selectors***************************************************************/
const baseSelector: (s: any) => state = s => s[key]

export const Selectors: {
  all: (a: any) => state;
  translations: (a: any) => state["translations"];
  selectedLanguage: (a: any) => string;
} = {
  all: baseSelector,
  translations:flow(baseSelector, x=>x.translations),
  selectedLanguage: (state: any): string => state[key].selectedLanguage
};
