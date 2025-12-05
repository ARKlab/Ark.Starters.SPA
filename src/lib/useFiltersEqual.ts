import type { ColumnFiltersState } from "@tanstack/react-table";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";

/**
 * Custom hook to compare two filter states
 */
export function useFiltersEqual(filtersA?: ColumnFiltersState, filtersB?: ColumnFiltersState): boolean {
  return useMemo(() => {
    if (!filtersA && !filtersB) return true;
    if (!filtersA || !filtersB) return false;
    if (filtersA.length !== filtersB.length) return false;

    return filtersA.every(filterA =>
      filtersB.some(filterB => filterA.id === filterB.id && isEqual(filterA.value, filterB.value)),
    );
  }, [filtersA, filtersB]);
}
