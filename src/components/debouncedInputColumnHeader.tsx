
import { useEffect, useState } from "react";

import useDebounce from "../lib/useDebounce";

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
  const [value, setValue] = useState(initialValue);
  const debounceValue = useDebounce(value, debounce);

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    onChange(debounceValue);
  }, [debounceValue, onChange]);

  return (
    <ChackraInputHeaderFilterWithClear
      value={value}
      onChange={(e) => { setValue(e.target.value); }}
      {...props}
    />
  )
}
