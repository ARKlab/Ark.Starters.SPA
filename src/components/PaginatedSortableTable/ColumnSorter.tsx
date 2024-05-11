import { TriangleDownIcon, TriangleUpIcon, UpDownIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import type { Column, SortDirection } from '@tanstack/react-table'
import React from 'react'

export const ColumnSorter = <T,>({
  column,
}: {
  column: Column<T>
}) => {
  if (!column.getCanSort()) {
    return null
  }

  const sorted = column.getIsSorted()

  return (
    <IconButton
      aria-label="Sort"
      size="xs"
      onClick={column.getToggleSortingHandler()}
      icon={<ColumnSorterIcon sorted={sorted} />}
      variant={sorted ? 'light' : 'transparent'}
      color={sorted ? 'primary' : 'gray'}
    />
  )
}

const ColumnSorterIcon = ({ sorted }: { sorted: false | SortDirection }) => {
  if (sorted === 'asc') return <TriangleUpIcon aria-label="sorted ascending" />
  if (sorted === 'desc')
    return <TriangleDownIcon aria-label="sorted descending" />
  return <UpDownIcon aria-label="sort" />
}
