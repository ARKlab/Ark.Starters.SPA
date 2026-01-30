/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import { createAsyncThunk } from "@reduxjs/toolkit"

import type { AppDispatch, ExtraType, AppState } from "./configureStore"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState
  dispatch: AppDispatch
  rejectValue: string
  extra: ExtraType
}>()
