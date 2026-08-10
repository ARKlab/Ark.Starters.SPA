import { IconButton } from "@chakra-ui/react"
import type { Column, RowData, SortDirection } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { LuChevronUp, LuChevronDown, LuChevronsUpDown } from "react-icons/lu"

import type { AppTableFeatures } from "./AppArkApiTable"

export const ColumnSorter = <T extends RowData>({
  column,
}: {
  column: Column<AppTableFeatures, T>
}) => {
  const { t } = useTranslation()

  if (!column.getCanSort()) {
    return null
  }

  const sorted = column.getIsSorted()

  return (
    <IconButton
      aria-label={t("libComponents:columnSorter_sort")}
      size="xs"
      onClick={column.getToggleSortingHandler()}
      variant={sorted ? "plain" : "ghost"}
      color={"brand.fg"}
    >
      <ColumnSorterIcon sorted={sorted} />
    </IconButton>
  )
}

const ColumnSorterIcon = ({ sorted }: { sorted: false | SortDirection }) => {
  const { t } = useTranslation()

  if (sorted === "asc")
    return <LuChevronUp aria-label={t("libComponents:columnSorter_sortedAscending")} />
  if (sorted === "desc")
    return <LuChevronDown aria-label={t("libComponents:columnSorter_sortedDescending")} />
  return <LuChevronsUpDown aria-label={t("libComponents:columnSorter_sort")} />
}
