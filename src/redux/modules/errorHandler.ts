import * as R from "ramda";

export const key = "errorHandler";

export enum actionTypes {
  SET_ERROR = "management/errorHandler/SET_ERROR",
  CLEAR_ERROR = "management/errorHandler/CLEAR_ERROR",
}

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
type Action =
  | {
      type: actionTypes.SET_ERROR;
      error: boolean;
      details: DetailsType | null;
    }
  | { type: actionTypes.CLEAR_ERROR };

export type errorModalType = {
  error?: boolean;
  details: DetailsType | null;
};

const errorDefault = {
  error: false,
  details: null,
};

export function reducer(
  state: errorModalType = errorDefault,
  action: Action
): any {
  switch (action.type) {
    case actionTypes.SET_ERROR:
      return {
        error: action.error,
        details: action.details,
      };
    case actionTypes.CLEAR_ERROR:
      return errorDefault;
    default:
      return state;
  }
}

export const setErrorAction = ({
  error = true,
  details = null,
}: errorModalType): { type: string } & any => {
  return {
    type: actionTypes.SET_ERROR,
    error,
    details,
  };
};

export const clearErrorAction = (): Action => ({
  type: actionTypes.CLEAR_ERROR,
});

export const Selectors: { all: (a: any) => errorModalType } = {
  all: R.prop(key),
};

export const dispatchNetworkError = (err: any): { type: string } => {
  let errorTitle = "an error occurred";
  const requestFailedTitle = "an error occurred";

  if (err.status > 0) {
    if (err.status >= 400 || err.status <= 500) {
      const title: string = R.pathOr("", ["response", "title"], err);
      const statusCode: number = R.pathOr(0, ["response", "status"], err);
      let errorDetails: ExceptionDetails | null = R.pathOr(
        null,
        ["response", "exceptionDetails"],
        err
      );
      let message: any;
      let isValError: boolean = false;
      let displayStatusCode = true;
      const errorCode: string = R.pathOr("", ["response", "errorCode"], err);

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

      return setErrorAction({
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
    return setErrorAction({
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
    return setErrorAction({
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
  return setErrorAction({
    details: {
      title: requestFailedTitle,
      message: err.errorMessage,
      originalTitle: err?.response?.title,
      originalDetail: err?.response?.detail,
      displayStatus: true,
    },
  });
};
