import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { ReactNode } from "react";

export type DetailsType = {
  title?: string;
  message?: string;
  btnTitle?: ReactNode;
  status?: string;
  displayStatus?: boolean;
  isValidationError?: boolean;
  originalTitle?: string;
  originalDetail?: string;
  exceptionDetails?: ExceptionDetails[] | null;
  traceId?: string;
};

type ExceptionDetails = {
  message: string;
  type: string;
  raw: string;
  stackFrames: {
    filePath: string | null;
    fileName: string | null;
    function: string | null;
    line: number | null;
    preContextLine: string | null;
    preContextCode: string | null;
    contextCode: string | null;
    postContextCode: string | null;
  }[];
};

export type errorModalType = {
  error?: boolean;
  details: DetailsType | null;
};

const initialState: errorModalType = {
  error: false,
  details: null,
};

const errorSlice = createSlice({
  name: "errorHandler",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<errorModalType>) => {
      state.error = action.payload.error;
      state.details = action.payload.details;
    },
    clearError: state => {
      state.error = false;
      state.details = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;

type Action = ReturnType<typeof setError> | ReturnType<typeof clearError>;

export const dispatchNetworkError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: any) => (dispatch: Dispatch<Action>) => {
    const errorTitle = "An error occurred";
    const isValError: boolean = false;
    const displayStatusCode = true;
    const message = err?.data?.message;
    dispatch(
      setError({
        error: true,
        details: {
          title: errorTitle,
          message: message,
          status: err?.status,
          isValidationError: isValError,
          originalTitle: err?.response?.title,
          originalDetail: err?.response?.detail,
          displayStatus: displayStatusCode,
          exceptionDetails: null,
        },
      }),
    );
  };

// eslint-disable-next-line @typescript-eslint/unbound-method
export const selectError = errorSlice.selectSlice;
