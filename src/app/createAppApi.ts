/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThunkDispatch } from "@reduxjs/toolkit";
import type { BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { buildCreateApi, coreModule, reactHooksModule } from "@reduxjs/toolkit/query/react";

import type { AppDispatch, ExtraType, RootState } from "./configureStore";

export const createAppApi = buildCreateApi(coreModule(), reactHooksModule());

interface X<D extends ThunkDispatch<any, any, any>, S, E> extends BaseQueryApi {
  dispatch: D;
  getState: () => S;
  extra: E;
}

export interface AppQueryApi extends X<AppDispatch, RootState, ExtraType> {}
