/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import { createAsyncThunk } from "@reduxjs/toolkit";

import type { AppDispatch, ExtraType, RootState } from "./configureStore";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra: ExtraType;
}>();
