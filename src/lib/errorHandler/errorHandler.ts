import type { PayloadAction } from "@reduxjs/toolkit"

import { createAppSlice } from "../../app/createAppSlice"

export interface ErrorDetailsType {
  title?: string | null
  message?: string | null
  status?: string
  details?: string | null
  stack?: string | null
  traceId?: string | null

  // TODO: add informations about the remote request in case of XHR as currently there are not info about the 'request' failed
}

export interface errorModalType {
  error?: boolean
  details: ErrorDetailsType | null
}

const initialState: errorModalType = {
  error: false,
  details: null,
}

const errorSlice = createAppSlice({
  name: "errorHandler",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<errorModalType>) => {
      state.error = action.payload.error
      state.details = action.payload.details
    },
    clearError: state => {
      state.error = false
      state.details = null
    },
  },
})

export const { setError, clearError } = errorSlice.actions

export default errorSlice.reducer

// eslint-disable-next-line @typescript-eslint/unbound-method
export const selectError = errorSlice.selectSlice
