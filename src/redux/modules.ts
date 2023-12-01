import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import {
  key as authKey,
  reducer as authReducer,
  epic as authEpic,
} from "./modules/authentication";
import {
  key as testKey,
  reducer as testReducer,
  epic as testEpic,
} from "./modules/testStore";

import {
  key as errorHandlerKey,
  reducer as errorHandlersReducer,
} from "./modules/errorHandler";
import { key as menuKey, reducer as menuReducer } from "./modules/menu";

import {
  key as languageKey,
  reducer as languageReducer,
  epic as languageEpic,
} from "./modules/language";

import {
  key as localeKey,
  reducer as localeReducer,
  epic as localeEpic,
} from "./modules/locale";

import {
  key as notificationKey,
  reducer as notificationReducer,
} from "./modules/common/notification";

export const rootReducer = (history: any) =>
  combineReducers({
    [testKey]: testReducer,
    [menuKey]: menuReducer,
    [authKey]: authReducer,
    [errorHandlerKey]: errorHandlersReducer,
    [languageKey]: languageReducer,
    [localeKey]: localeReducer,
    [notificationKey]: notificationReducer,
  });

export const rootEpic = combineEpics(
  authEpic,
  languageEpic,
  localeEpic,
  testEpic
);
