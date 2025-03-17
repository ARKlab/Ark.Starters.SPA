import { Center, Spinner, Table } from "@chakra-ui/react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { z, ZodObject, ZodRawShape } from "zod";

import type { ProblemDetailsError } from "../../../lib/rtk/withProblemDetails";
import type { ZodSchemaError } from "../../../lib/rtk/withZodResultValidation";

export type PlainTablePropsType<T extends ZodRawShape> = {
  data: z.infer<ZodObject<T>>[] | undefined;
  colorPalette?: string;
  variant?: "line" | "outline";
  striped?: boolean;
  isLoading: boolean;
  isError: boolean;
  schema: ZodObject<T>;
  error: ProblemDetailsError | ZodSchemaError | FetchBaseQueryError | SerializedError | undefined;
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

  const notFetchingError = isError && error && data === undefined;
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
