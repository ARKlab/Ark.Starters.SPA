import { Icon, IconButton } from '@chakra-ui/react'
import type { Column, SortDirection } from '@tanstack/react-table'
import React from 'react'
import { MdArrowDropUp, MdArrowDropDown, MdSwapVert } from "react-icons/md";

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
      variant={sorted ? "subtle" : "ghost"}
      color="primary"
    >
      <ColumnSorterIcon sorted={sorted} />
    </IconButton>
  );
};

const ColumnSorterIcon = ({ sorted }: { sorted: false | SortDirection }) => {
  if (sorted === 'asc') {
    return <Icon><MdArrowDropUp/></Icon>;
  }
  if (sorted === 'desc') {
    return <Icon><MdArrowDropDown/></Icon>;
  }
  return <Icon><MdSwapVert/></Icon>;
};
