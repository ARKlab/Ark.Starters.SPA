import { IconButton } from "@chakra-ui/react"
import type { Column, SortDirection } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { LuChevronUp, LuChevronDown, LuChevronsUpDown } from "react-icons/lu"

export const ColumnSorter = <T,>({ column }: { column: Column<T> }) => {
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
