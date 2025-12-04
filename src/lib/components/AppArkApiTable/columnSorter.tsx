import { IconButton } from "@chakra-ui/react";
import type { Column, SortDirection } from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { RiExpandUpDownFill } from "react-icons/ri";

export const ColumnSorter = <T,>({ column }: { column: Column<T> }) => {
  const { t } = useTranslation();
  
  if (!column.getCanSort()) {
    return null;
  }

  const sorted = column.getIsSorted();

  return (
    <IconButton
      aria-label={t("libComponents:columnSorter_sort")}
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
  const { t } = useTranslation();
  
  if (sorted === "asc") return <GoTriangleUp aria-label={t("libComponents:columnSorter_sortedAscending")} />;
  if (sorted === "desc") return <GoTriangleDown aria-label={t("libComponents:columnSorter_sortedDescending")} />;
  return <RiExpandUpDownFill aria-label={t("libComponents:columnSorter_sort")} />;
};
