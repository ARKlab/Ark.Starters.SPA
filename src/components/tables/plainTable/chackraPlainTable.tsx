import { Center, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { z, ZodObject, ZodRawShape } from "zod";

import { useAppDispatch } from "../../../app/hooks";
import type { DetailsType } from "../../../lib/errorHandler/errorHandler";
import { setError } from "../../../lib/errorHandler/errorHandler";
import { isErrorWithMessage, isFetchBaseQueryError } from "../../../lib/errorHandler/errorHandlingLib";

export type PlainTablePropsType<T extends ZodRawShape> = {
  data: z.infer<ZodObject<T>>[] | undefined;
  colorPalette?: string;
  variant?: string;
  isLoading: boolean;
  isError: boolean;
  schema: ZodObject<T>;
  error: FetchBaseQueryError | SerializedError | undefined;
};

export const ChackraPlainTable = <T extends ZodRawShape>({
  data,
  colorPalette = "grey",
  variant = "striped",
  isLoading,
  isError,
  error,
  schema,
}: PlainTablePropsType<T>) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const notFetchingError = isError && error && data === undefined;
  if (isError && error) {
    const details = _getDetails(error);
    if (data === undefined) {
      dispatch(setError({ error: true, details }));
    } else {
      //THIS CASE IS FOR POLLING ONLY. IF YOU FETCH DATA CORRECTLY BUT ONE OF THE SUBSEQUENT POLLS FAILS YOU WILL HAVE BOTH DATA AND ERROR
      //IN THIS EXAMPLE WE WILL NOT DISPATCH AN ERROR BUT WE WILL SHOW A TOAST
      toast({
        title: "Fetching Error",
        description: details.message,
        duration: 2000,
        position: "bottom-right",
      });
    }
  }
  const headers = Object.keys(schema.shape) as (keyof T)[];
  return (
    <TableContainer my="30px">
      <Table variant={variant} colorPalette={colorPalette}>
        <Thead>
          <Tr>
            {headers.map(header => (
              <Th key={String(header)}>{String(header)}</Th>
            ))}
          </Tr>
        </Thead>
        {notFetchingError ? (
          <Tbody>
            <Tr>
              <Td colSpan={headers.length}>
                <Center></Center>
              </Td>
            </Tr>
          </Tbody>
        ) : (
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={headers.length}>
                  <Center>
                    <Spinner data-role="spinner" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data?.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {headers.map(header => (
                    <Td key={String(header)}>{row[header] as any}</Td> // eslint-disable-line @typescript-eslint/no-explicit-any
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        )}
      </Table>
    </TableContainer>
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
