import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import * as R from "ramda";
import { RootState } from "../../app/configureStore";

export type DetailsType = {
  title?: string;
  message?: any;
  btnTitle?: any;
  status?: any;
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
    clearError: (state) => {
      state.error = false;
      state.details = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;

type Action = ReturnType<typeof setError> | ReturnType<typeof clearError>;

export const dispatchNetworkError =
  (err: any) => (dispatch: Dispatch<Action>) => {
    let errorTitle = "An error occurred";
    let isValError: boolean = false;
    let displayStatusCode = true;
    let message = err?.data?.message;
    dispatch(
      setError({
        error: true,
        details: {
          title: errorTitle,
          message: message,
          status: err.status,
          isValidationError: isValError,
          originalTitle: err?.response?.title,
          originalDetail: err?.response?.detail,
          displayStatus: displayStatusCode,
          exceptionDetails: null,
        },
      })
    );
  };

export const selectError = errorSlice.selectSlice ;
