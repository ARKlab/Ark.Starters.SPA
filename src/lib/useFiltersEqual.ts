import type { ColumnFiltersState } from "@tanstack/react-table"
import equal from "fast-deep-equal"

/**
 * Custom hook to compare two filter states
 */
export function useFiltersEqual(filtersA?: ColumnFiltersState, filtersB?: ColumnFiltersState): boolean {
  if (!filtersA && !filtersB) return true
  if (!filtersA || !filtersB) return false
  if (filtersA.length !== filtersB.length) return false

  return filtersA.every(filterA =>
    filtersB.some(filterB => filterA.id === filterB.id && equal(filterA.value, filterB.value)),
  )
}
