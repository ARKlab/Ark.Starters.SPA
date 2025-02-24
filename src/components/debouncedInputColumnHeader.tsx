

import { useEffect } from "react";

import { useDebouncedState } from "../lib/useDebounce";

import { ChackraInputHeaderFilterWithClear } from "./chackraInputFilterWithClear/chackraInputHeaderFilterWithClear";

type DebouncedInputColumnHeaderProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size">;

export function DebouncedInputColumnHeader({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputColumnHeaderProps) {

  const [value, setValue] = useDebouncedState(initialValue, debounce);

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ChackraInputHeaderFilterWithClear
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      {...props}
    />
  )
}
