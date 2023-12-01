import * as R from "ramda";

export type translation = {
  key: string;
  param1: any | null,
  param2: any | null,
  param3: any | null,
  param4: any | null,
  param5: any | null,
  param6: any | null,
  translate: <A>(t: Record<string, A>) => A;
};

export type errorTranslation = {
  key: string;
  param1: string,
  param2: string,
  param3: string,
  param4: string,
  param5: string,
  param6: string,
  translate: <A>(t: Record<string, A>) => A;
};

export const basicTranslation = (
  key: string
  , param1?: any | null
  , param2?: any | null
  , param3?: any | null
  , param4?: any | null
  , param5?: any | null
  , param6?: any | null): translation => ({
  key,
  param1: param1,
  param2: param2,
  param3: param3,
  param4: param4,
  param5: param5,
  param6: param6,
  translate: R.prop(key)
});

export const errorTranslationWithParams = (
  key: string
  , param1?: any | null
  , param2?: any | null
  , param3?: any | null
  , param4?: any | null
  , param5?: any | null
  , param6?: any | null
  ): errorTranslation => ({
  key,
  param1: param1,
  param2: param2,
  param3: param3,
  param4: param4,
  param5: param5,
  param6: param6,
  translate: R.prop(key)
});
