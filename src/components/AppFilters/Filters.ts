import type { SelectRootProps } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react/input";

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
  collection: SelectRootProps["collection"];
  selectProps?: SelectRootProps;
};

type CustomerFilter<T> = BaseFilter<T> & {
  type: "select-customer";
};

export type FilterDefinition<T> =
  | CheckboxFilter<T>
  | TextFilter<T>
  | InputFilter<T>
  | SelectFilter<T>
  | CustomerFilter<T>;

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
