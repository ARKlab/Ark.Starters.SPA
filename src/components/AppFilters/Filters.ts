import type { SelectRootProps } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react/input";

import type { AppSelectOptionItem } from "../../lib/components/AppSelect/appSelect";

type BaseFilter<T> = {
  id: string;
  propName: keyof T;
  label?: string;
  placeholder?: string;
  hint?: string;
  getDisplayValue?: (value: unknown) => string;
};

type CheckboxFilter<T> = BaseFilter<T> & {
  type: "checkbox";
  labelOff?: string;
};

type TextFilter<T> = BaseFilter<T> & {
  type: "text";
};

type InputFilter<T> = BaseFilter<T> & {
  type: "input";
  inputProps?: InputProps;
};

type SelectFilter<T> = BaseFilter<T> & {
  type: "select";
  collection: AppSelectOptionItem[];
  selectProps?: SelectRootProps;
};

export type FilterDefinition<T> =
  | CheckboxFilter<T>
  | TextFilter<T>
  | InputFilter<T>
  | SelectFilter<T>;

export type FilterType = FilterDefinition<unknown>["type"];

export interface FilterOption {
  label: string;
  value: string;
}

export interface ActiveFilter {
  filterId: string;
  label: string;
  value: string | string[] | { from: string; to: string };
  displayValue: string;
}
