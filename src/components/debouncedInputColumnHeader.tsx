import React from "react";
import { ChackraInputHeaderFilterWithClear } from "./chackraInputFilterWithClear/chackraInputHeaderFilterWithClear";
import useDebounce from "../lib/useDebounce";

export function DebouncedInputColumnHeader({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size">) {
  const [value, setValue] = React.useState(initialValue);
  const debounceValue = useDebounce(value, debounce);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    onChange(debounceValue);
  }, [debounceValue, onChange]);

  return (
    <ChackraInputHeaderFilterWithClear
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}
