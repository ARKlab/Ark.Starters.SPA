import React from "react";
import { ChackraInputHeaderFilterWithClear } from "./chackraInputFilterWithClear/chackraInputHeaderFilterWithClear";

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

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <ChackraInputHeaderFilterWithClear
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}
