import { Center, Spinner, Table } from "@chakra-ui/react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { z, ZodObject, ZodRawShape } from "zod";

import { useAppDispatch } from "../../../app/hooks";
import type { DetailsType } from "../../../lib/errorHandler/errorHandler";
import { setError } from "../../../lib/errorHandler/errorHandler";
import { isErrorWithMessage, isFetchBaseQueryError } from "../../../lib/errorHandler/errorHandlingLib";
import { toaster } from "../../ui/toaster";

export type PlainTablePropsType<T extends ZodRawShape> = {
  data: z.infer<ZodObject<T>>[] | undefined;
  colorPalette?: string;
  variant?: "line" | "outline";
  striped?: boolean;
  isLoading: boolean;
  isError: boolean;
  schema: ZodObject<T>;
  error: FetchBaseQueryError | SerializedError | undefined;
};

export const ChackraPlainTable = <T extends ZodRawShape>({
  data,
  colorPalette = "brand",
  variant = "line",
  striped = true,
  isLoading,
  isError,
  error,
  schema,
}: PlainTablePropsType<T>) => {
  const dispatch = useAppDispatch();
  const notFetchingError = isError && error && data === undefined;
  if (isError && error) {
    const details = _getDetails(error);
    if (data === undefined) {
      dispatch(setError({ error: true, details }));
    } else {
      //THIS CASE IS FOR POLLING ONLY. IF YOU FETCH DATA CORRECTLY BUT ONE OF THE SUBSEQUENT POLLS FAILS YOU WILL HAVE BOTH DATA AND ERROR
      //IN THIS EXAMPLE WE WILL NOT DISPATCH AN ERROR BUT WE WILL SHOW A TOAST
      toaster.create({
        title: "Fetching Error",
        description: details.message,
        duration: 2000,
      });
    }
  }
  const headers = Object.keys(schema.shape) as (keyof T)[];
  return (
    <>
      <Table.Root my="30px" variant={variant} colorPalette={colorPalette} striped={striped}>
        <Table.Header>
          <Table.Row>
            {headers.map(header => (
              <Table.ColumnHeader key={String(header)}>{String(header)}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        {notFetchingError ? (
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={headers.length}>
                <Center></Center>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={headers.length}>
                  <Center>
                    <Spinner data-role="spinner" />
                  </Center>
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {headers.map(header => (
                    <Table.Cell key={String(header)}>{row[header] as any}</Table.Cell> // eslint-disable-line @typescript-eslint/no-explicit-any
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        )}
      </Table.Root>
    </>
  );
};

function _getDetails(error: FetchBaseQueryError | SerializedError | undefined): DetailsType {
  let details = {} as DetailsType;
  if (isFetchBaseQueryError(error)) {
    details = {
      title: "Fetching Error",
      message: "error" in error ? error.error : JSON.stringify(error.data),
      status: error.status,
      isValidationError: false,
      exceptionDetails: null,
    } as DetailsType;
  } else if (isErrorWithMessage(error)) {
    details = {
      title: "Fetching Error",
      message: error.message,
      isValidationError: false,
      exceptionDetails: null,
    } as DetailsType;
  }
  return details;
}
