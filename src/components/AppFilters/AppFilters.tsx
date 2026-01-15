import { t } from "i18next";

import { ActiveFiltersBar } from "./ActiveFilters";
import type { FilterDefinition } from "./Filters";
import { FilterSidebar } from "./FiltersSideBar";

type AppFiltersProps<T extends object> = {
  i18nPrefix?: string;
  isOpen: boolean;
  onClose: () => void;
  filters: Partial<T>;
  filterDefinitions: FilterDefinition<T>[];
  onFiltersChange?: (newFilters: Partial<T>) => void;
};

export function AppFilters<T extends object>(props: AppFiltersProps<T>) {
  const { isOpen, onClose, filters, filterDefinitions } = props;

  function onApplyFilter(newFilters: Partial<T>) {
    props.onFiltersChange?.(newFilters);
  }

  const activeFilters = Object.entries(filters as Record<string, unknown>)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => {
      const filterDef = filterDefinitions.find(f => f.id === key);
      const displayValue = filterDef?.getDisplayValue ? filterDef.getDisplayValue(value) : (value?.toString() ?? "");

      return {
        filterId: key,
        label: props.i18nPrefix ? t(`${props.i18nPrefix}.filters.by_${key}_label`) : key,
        value: value?.toString() ?? "",
        displayValue,
      };
    });

  function onRemoveFilter(filterId: string) {
    const newFilters = { ...filters, [filterId]: undefined };
    props.onFiltersChange?.(newFilters);
  }

  function onClearAllFilters() {
    const newFilters = {} as Partial<T>;
    props.onFiltersChange?.(newFilters);
  }

  return (
    <>
      <ActiveFiltersBar filters={activeFilters} onRemoveFilter={onRemoveFilter} onClearAll={onClearAllFilters} />

      <FilterSidebar<T>
        isOpen={isOpen}
        onClose={onClose}
        filters={filters}
        filterDefinitions={filterDefinitions}
        onApplyFilter={onApplyFilter}
      />
    </>
  );
}
