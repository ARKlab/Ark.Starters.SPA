import { Center, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { z, ZodObject, ZodRawShape } from "zod";

import type { DetailsType } from "../../../lib/errorHandler/errorHandler";
import { setError } from "../../../lib/errorHandler/errorHandler";
import { isErrorWithMessage, isFetchBaseQueryError } from "../../../lib/errorHandler/errorHandlingLib";

export type PlainTablePropsType<T extends ZodRawShape> = {
  data: z.infer<ZodObject<T>>[];
  colorscheme?: string;
  variant?: string;
  isLoading: boolean;
  isError: boolean;
  schema: ZodObject<T>;
  error: FetchBaseQueryError | SerializedError | undefined;
};

export const ChackraPlainTable = <T extends ZodRawShape>({
  data,
  colorscheme = "grey",
  variant = "striped",
  isLoading,
  isError,
  error,
  schema,
}: PlainTablePropsType<T>) => {
  if (isError && error) {
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
      // you can access a string 'message' property here
      details = {
        title: "Fetching Error",
        message: error.message,
        isValidationError: false,
        exceptionDetails: null,
      } as DetailsType;
    }
    setError({ error: true, details });
    return <></>;
  } else {
    const headers = Object.keys(schema.shape) as (keyof T)[];
    return (
      <TableContainer my="30px">
        <Table variant={variant} colorScheme={colorscheme}>
          <Thead>
            <Tr>
              {headers.map(header => (
                <Th key={String(header)}>{String(header)}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={headers.length}>
                  <Center>
                    <Spinner />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {headers.map(header => (
                    <Td key={String(header)}>{row[header] as any}</Td> // eslint-disable-line @typescript-eslint/no-explicit-any
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
};
