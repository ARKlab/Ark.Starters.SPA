import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as R from "ramda";

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

export const dispatchNetworkError = (err: any) => (dispatch: any) => {
  let errorTitle = "An error occurred";
  let message: any;
  let isValError: boolean = false;
  let displayStatusCode = true;
  let requestFailedTitle = "An error occurred";
  if (err === "parser error") {
    return setError({
      details: {
        title: "Response Parsing Error",
        message:
          "Server's type response is not compatible with the expected response.",
        originalTitle: "Response Type",
        originalDetail: err?.response?.detail,
        displayStatus: true,
      },
    });
  }
  if (err.status > 0) {
    if (err.status >= 400 || err.status <= 500) {
      const title: string = R.pathOr("", ["response", "title"], err);
      const statusCode: number = R.pathOr(0, ["response", "status"], err);
      let errorDetails: ExceptionDetails | null = R.pathOr(
        null,
        ["response", "exceptionDetails"],
        err
      );

      if (title === "") {
        message = err.message;
      } else if (statusCode === 400) {
        const errorList = R.pathOr([], ["response", "errors"], err);
        const valueList = R.values(errorList);
        isValError = true;

        if (valueList != null && valueList.length > 0) {
          valueList.forEach((element: any) => {
            message = err.message;
          });
        } else message = err.message;
      } else if (statusCode === 403) {
        errorTitle = err.message;

        displayStatusCode = false;
        message = err.message;
      } else message = err.message;

      return setError({
        details: {
          title: errorTitle,
          message: message,
          status: err.status,
          isValidationError: isValError,
          originalTitle: err?.response?.title,
          originalDetail: err?.response?.detail,
          displayStatus: displayStatusCode,
          exceptionDetails: errorDetails,
        },
      });
    }
    return setError({
      details: {
        title: errorTitle,
        message: err.message,
        status: err.status,
        originalTitle: err?.response?.title,
        originalDetail: err?.response?.detail,
        displayStatus: true,
      },
    });
  }

  if (err.customError) {
    return setError({
      details: {
        title: errorTitle,
        message: err.errorMessage,
        status: err.status,
        originalTitle: err?.response?.title,
        originalDetail: err?.response?.detail,
        displayStatus: true,
      },
    });
  }
  return setError({
    details: {
      title: requestFailedTitle,
      message: err.errorMessage,
      originalTitle: err?.response?.title,
      originalDetail: err?.response?.detail,
      displayStatus: true,
    },
  });
};

export const Selectors: { all: (a: any) => errorModalType } = {
  all: R.prop(errorSlice.name),
};
