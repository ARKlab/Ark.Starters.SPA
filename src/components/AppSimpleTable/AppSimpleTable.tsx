import { Box, Spinner, Table } from "@chakra-ui/react"
import React, { useState } from "react"

import AppPagination from "../../lib/components/AppPagination/AppPagination"

export type Column<T> = {
  header: string
  accessor?: keyof T | string // Supports direct or nested accessors
  render?: (row: T) => React.ReactNode // Custom render function
}

type AppSimpleTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  isLoading?: boolean
}

//eslint-disable-next-line
const getNestedValue = <T,>(obj: T, path: string, defaultValue: any = null): any => {
  const keys = path.split(".")
  //eslint-disable-next-line
  let result: any = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue
    }
    result = result[key]
  }

  return result === undefined ? defaultValue : result
}

const AppSimpleTable = <T,>({
  data,
  columns,
  pageSize = 20,
  isLoading = false,
}: AppSimpleTableProps<T>) => {
  const [pageIndex, setPageIndex] = useState(1)
  const [itemPerPage, setPageSize] = useState(pageSize)

  const paginatedData = data.slice((pageIndex - 1) * itemPerPage, pageIndex * itemPerPage)
  const onPageChange = (page: number) => {
    setPageIndex(page)
  }
  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize)
  }
  return (
    <Box>
      <Table.ScrollArea>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              {columns.map((column, colIndex) => (
                <Table.ColumnHeader key={colIndex}>{column.header}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!isLoading ? (
              paginatedData.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <Table.Cell key={colIndex}>
                      {column.render
                        ? column.render(row) // Use custom render function if provided
                        : column.accessor
                          ? typeof column.accessor === "string"
                            ? getNestedValue(row, column.accessor) // Handle nested accessors
                            : row[column.accessor] // Handle direct accessors
                          : null}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Spinner />
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <AppPagination
        count={data.length}
        page={pageIndex}
        pageSize={itemPerPage}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={false}
      />
    </Box>
  )
}

export default AppSimpleTable
