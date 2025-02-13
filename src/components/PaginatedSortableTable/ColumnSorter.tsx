import { IconButton } from "@chakra-ui/react";
import type { Column, SortDirection } from "@tanstack/react-table";
import React from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { RiExpandUpDownFill } from "react-icons/ri";

export const ColumnSorter = <T,>({ column }: { column: Column<T> }) => {
  if (!column.getCanSort()) {
    return null;
  }

  const sorted = column.getIsSorted();

  return (
    <IconButton
      aria-label="Sort"
      size="xs"
      onClick={column.getToggleSortingHandler()}
      variant={sorted ? "plain" : "ghost"}
      color={"primary"}
    >
      <ColumnSorterIcon sorted={sorted} />
    </IconButton>
  );
};

const ColumnSorterIcon = ({ sorted }: { sorted: false | SortDirection }) => {
  if (sorted === "asc") return <GoTriangleUp aria-label="sorted ascending" />;
  if (sorted === "desc") return <GoTriangleDown aria-label="sorted descending" />;
  return <RiExpandUpDownFill aria-label="sort" />;
};
