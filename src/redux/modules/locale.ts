import { ActionsObservable, combineEpics } from "redux-observable";
import { defer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ofType } from "../reduxObservableUtils";
import { Dependancies } from "../storeTypes";
import * as io from "io-ts";
import { pipe } from "fp-ts/lib/function";
import { match, chain, fromIO } from "fp-ts/lib/TaskEither";
import { dispatchNetworkError } from "./errorHandler";
import * as Async from "../../utils/async";

export const key = "locale";

//Get by Id ********************************************************************//
const countryGetAllLoadingType = "country/GET_ALL/LOADING";
const countryGetAllSuccessType = "country/GET_ALL/LOADED";
const countryGetAllFailedType = "country/GET_ALL/FAILED";

export const countryGetAllLoadingAction = () =>
({
  type: countryGetAllLoadingType,
} as const);

export const countryGetAllSuccessAction = (countryList: Country[]) =>
  ({ type: countryGetAllSuccessType, countryList: countryList} as const);

export const countryGetAllFailedAction = {
  type: countryGetAllFailedType,
} as const;

const getAllCountryEpic = (
  action$: ActionsObservable<Action>,
  _: any,
  deps: Dependancies
) =>
  action$.pipe(
    ofType(countryGetAllLoadingType),
    switchMap((x) =>
      pipe(
        deps.request.get(
          (`locale/country`)
          ,
          countryListDecoder
        ),
        match(
          dispatchNetworkError,
          (p: Country[]) => countryGetAllSuccessAction(p)
        ),
        defer
      )
    )
  );

 

// Common ******************************************************************//
type Action =
  | typeof countryGetAllFailedAction
  
  | ReturnType<
    | typeof countryGetAllLoadingAction
    | typeof countryGetAllSuccessAction
  >;

type State = Async.Async<string, Country[]>;


export function reducer(state: State = Async.initial, action: Action): State {
  switch (action.type) {
    case countryGetAllLoadingType:
      return Async.inProgress;
    case countryGetAllFailedType:
      return Async.error("Could not Load country status");
    case countryGetAllSuccessType:
      return Async.success(action.countryList);
    default:
      return state;
  }
}


const baseSelector = (s: any): State => s[key];
const countryListSelector = (s: any): Country[] => s[key];
const localitySelector = (s: any): Locality[] => s[key];

export const Selectors = {
  all: baseSelector,
  countryList: countryListSelector,
  locality: localitySelector,
};

export const epic = combineEpics(
  getAllCountryEpic
);

const languagesDecoder = io.type({
  alpha2: io.string,
  alpha3B: io.string,
  alpha3T: io.string,
  name: io.string,
  code: io.string,
  languageName: io.string,
});

const currenciesDecoder = io.type({
  alpha3: io.string,
  name: io.string,
  numCode: io.number,
});

const countryDecoder = io.type({
  countryCode: io.string,
  alpha2: io.string,
  alpha3: io.string,
  name: io.string,
//  currencies: io.union([currenciesDecoder, io.nullType]),
//  languages: io.union([languagesDecoder, io.nullType]),
});

const countryDependentLocalityDecoder = io.type({
  countryCode: io.string,
  code: io.string,
  localityCode: io.string,
  dependantLocalityName: io.string,
  auditId: io.string,
});

const countryLocalityDecoder = io.type({
  countryCode: io.string,
  code: io.string,
  subdivisionCode: io.string,
  localityname: io.string,
  auditId: io.string,
});

const countryListDecoder = io.array(countryDecoder);
const localityListDecoder = io.array(countryLocalityDecoder)

export type Country = io.TypeOf<typeof countryDecoder>;
export type DependentLocality = io.TypeOf<typeof countryDependentLocalityDecoder>;
export type Locality = io.TypeOf<typeof countryLocalityDecoder>;

