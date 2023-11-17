import { ActionsObservable, combineEpics } from "redux-observable";
import { defer } from "rxjs";
import { switchMap } from "rxjs/operators";
import * as RxOp from "rxjs/operators";
import { Dependancies } from "../storeTypes";
import { pipe } from "fp-ts/lib/function";
import { match } from "fp-ts/lib/TaskEither";
import { dispatchNetworkError } from "./errorHandler";

import { searchBuilder } from "../helper";
import {
  testReduxFiltersType,
  testReduxType,
  testReduxTypeDecoder,
} from "./testStoreTypes";

export const key = "testRedux";
const testReduxFetchSuccessType = "testRedux/SUCCESS";
const testReduxFetchFailedType = "testRedux/FAILED";
const testReduxFetchScBulkUploads = "testRedux/FETCHDATA";
export const testReduxSubmittedAction = (filter: testReduxFiltersType) =>
  ({
    type: testReduxFetchScBulkUploads,
    filter,
  } as const);

const testReduxSuccessAction = (paginatedResponse: testReduxType) =>
  ({ type: testReduxFetchSuccessType, paginatedResponse } as const);

export const testReduxFailedAction = {
  type: testReduxFetchFailedType,
} as const;

// Common ******************************************************************//
type Action =
  | typeof testReduxFailedAction
  | ReturnType<typeof testReduxSubmittedAction | typeof testReduxSuccessAction>;

type State = {
  testReduxTable:
    | { tag: "initial" }
    | { tag: "loading" }
    | {
        tag: "success";
        paginatedResponse: testReduxType;
      }
    | { tag: "error" };
  testReduxUploadProcess:
    | { tag: "initial" }
    | { tag: "loading"; file: Blob; parser: string }
    | {
        tag: "success";
      }
    | { tag: "error" };
};
const initialState: State = {
  testReduxTable: { tag: "initial" },
  testReduxUploadProcess: { tag: "initial" },
};

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case testReduxFetchScBulkUploads:
      return { ...state, testReduxTable: { tag: "loading" } };
    case testReduxFetchFailedType:
      return { ...state, testReduxTable: { tag: "error" } };
    case testReduxFetchSuccessType:
      return {
        ...state,
        testReduxTable: {
          tag: "success",
          paginatedResponse: action.paginatedResponse,
        },
      };
    default:
      return state;
  }
}

const testReduxEpic = (
  action$: ActionsObservable<Action>,
  state$: any,
  deps: Dependancies
) =>
  action$.pipe(
    RxOp.filter((action) => action.type === testReduxFetchScBulkUploads),
    switchMap((x: any) => {
      let filters = x.filter;
      return pipe(
        deps.request.get(
          `scbulkupload?skip=0&limit=50${searchBuilder(filters)}`,
          testReduxTypeDecoder
        ),
        match(dispatchNetworkError, (paginatedResponse) => {
          return testReduxSuccessAction(paginatedResponse);
        }),
        defer
      );
    })
  );

const baseSelector = (s: any): State => s[key];

export const Selectors = {
  all: baseSelector,
};

export const epic = combineEpics(testReduxEpic);
