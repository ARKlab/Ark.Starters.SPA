import type { BaseQueryArg, QueryReturnValue } from "@reduxjs/toolkit/query";
import i18next from "i18next";

import { toaster } from "../../components/ui/toaster";
import type { ErrorDetailsType } from "../errorHandler/errorHandler";
import { setError } from "../errorHandler/errorHandler";

import type {
  ArkBaseQueryError,
  ArkBaseQueryMeta,
  ArkBaseQueryResult,
  ArkBaseQueryFn,
  ArkBaseQueryExtraOptions,
  ArkBaseQueryApi,
} from "./arkBaseQuery";

export type withToasterType = <BaseQuery extends ArkBaseQueryFn>(
  baseQuery: BaseQuery,
  config?: {
    toDetails: (props: {
      error: ArkBaseQueryError<BaseQuery>;
      meta: ArkBaseQueryMeta<BaseQuery>;
      extra?: NonNullable<ArkBaseQueryExtraOptions<BaseQuery>> & { disableAutoToast?: boolean };
    }) => ErrorDetailsType;
  },
) => ArkBaseQueryFn<
  BaseQueryArg<BaseQuery>,
  ArkBaseQueryResult<BaseQuery>,
  ArkBaseQueryError<BaseQuery>,
  ArkBaseQueryExtraOptions<BaseQuery> & { disableAutoToast?: boolean },
  NonNullable<ArkBaseQueryMeta<BaseQuery>>,
  ArkBaseQueryApi<BaseQuery>
>;

/**
 * HOF that wraps a base query function with additional functionality for data validation using zod
 *
 * @param baseQuery The base query function to be wrapped.
 * @returns A modified version of the baseQuery with added data validation.
 */
export const withToaster: withToasterType = (baseQuery, config) => async (args, api, extraOptions) => {
  if (extraOptions?.disableAutoToast) {
    return (await baseQuery(args, api, extraOptions)) as QueryReturnValue<
      ArkBaseQueryResult<typeof baseQuery>,
      ArkBaseQueryError<typeof baseQuery>,
      ArkBaseQueryMeta<typeof baseQuery>
    >;
  }

  const id = crypto.randomUUID();

  if (api.type === "mutation") {
    toaster.loading({ id: id, title: i18next.t("errorHandler.submitting", { ns: "template" }) });
  }

  // Call the original baseQuery function with the provided arguments
  const returnValue = (await baseQuery(args, api, extraOptions)) as QueryReturnValue<
    ArkBaseQueryResult<typeof baseQuery>,
    ArkBaseQueryError<typeof baseQuery>,
    ArkBaseQueryMeta<typeof baseQuery>
  >;

  config ??= {
    toDetails: ({ error }) => {
      return {
        title: i18next.t("errorHandler.error", { ns: "template" }),
        message: "",
        details: JSON.stringify(error, null, 2),
      };
    },
  };

  if (returnValue.error) {
    const { error, meta } = returnValue;

    const details = config.toDetails({ error, meta, extra: extraOptions });

    toaster.error({
      id: id,
      title: details.title,
      description: details.message,
      action:
        details.details || details.stack
          ? {
              label: i18next.t("errorHandler.actionLabel", { ns: "template" }),
              onClick: () => {
                api.dispatch(setError({ error: true, details }));
                toaster.dismiss(id);
              },
            }
          : undefined,
      duration: 15 * 1000,
    });
  } else if (api.type === "mutation") {
    toaster.success({ id: id, title: i18next.t("errorHandler.success", { ns: "template" }) });
  }

  return returnValue;
};
