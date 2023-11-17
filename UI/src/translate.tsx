import * as R from "ramda";
import React, { useState, useEffect } from "react";
import { connect, ReactReduxContext, useSelector } from "react-redux";
import { Store } from "redux";
import { fromNullable, isLeft } from "fp-ts/es6/Either";
import { pipe } from "fp-ts/es6/function";
import { Selectors } from "./redux/modules/language";
import { errorTranslation, translation } from "./translations/common";

type TranslateProps = {
  children: translation;
};

export function Translate(props: TranslateProps) {
  const selectedLanguage = useSelector(Selectors.selectedLanguage);
  const translations = useSelector(Selectors.translations);

  let translate = "";
  try {
    translate = props.children.translate(translations)[selectedLanguage];
  } catch (error) {
    console.log("Translation not found for: " + props.children);
  }

  return (
    <>
      {translate}
    </>
  );
}

export function TranslateToString(translation: translation , language: string, availableTranslations: Record<string, Record<string, string>>): string {

  let translate = "";

  try {
    translate = translation.translate(availableTranslations)[language];
  } catch (error) {
    console.log("Translation not found for: " + translation);
  }

  return translate;
}

export const useTranslate = () => {
  const selectedLanguage = useSelector(Selectors.selectedLanguage);
  const translations = useSelector(Selectors.translations);

  return function (t: translation) {
    let translate = "";
    try {
      translate = translations[t.key][selectedLanguage];
    } catch (error) {
      console.log("Translation not found for: " + t.key);
    }

    let replacedTranslate = translate;

    if (t.param1) {
      replacedTranslate = R.replace("{0}", t.param1, replacedTranslate);
    }

    if (t.param2) {
      replacedTranslate = R.replace("{1}", t.param2, replacedTranslate);
    }

    if (t.param3) {
      replacedTranslate = R.replace("{2}", t.param3, replacedTranslate);
    }

    if (t.param4) {
      replacedTranslate = R.replace("{3}", t.param4, replacedTranslate);
    }

    if (t.param5) {
      replacedTranslate = R.replace("{4}", t.param5, replacedTranslate);
    }

    if (t.param6) {
      replacedTranslate = R.replace("{5}", t.param6, replacedTranslate);
    }

    return replacedTranslate;
  };
};

export const useErrorTranslate = () => {
  const selectedLanguage = useSelector(Selectors.selectedLanguage);
  const translations = useSelector(Selectors.translations);

  return function (t: errorTranslation) {
    let translate = "";
    try {
      translate = translations[t.key][selectedLanguage];
    } catch (error) {
      console.log("Translation not found for: " + t.key);
    }

    let replacedTranslate = "";
    if (t.param1 !== null) {
      replacedTranslate = R.replace("{0}", t.param1, translate);

      if (t.param2 !== null)
        replacedTranslate = R.replace("{1}", t.param2, replacedTranslate);

      if (t.param3 !== null)
        replacedTranslate = R.replace("{2}", t.param3, replacedTranslate);

      if (t.param4 !== null)
        replacedTranslate = R.replace("{3}", t.param4, replacedTranslate);

      if (t.param5 !== null)
        replacedTranslate = R.replace("{4}", t.param5, replacedTranslate);

      if (t.param6 !== null)
        replacedTranslate = R.replace("{5}", t.param6, replacedTranslate);
    }

    return replacedTranslate;
  };
};

export default Translate;
