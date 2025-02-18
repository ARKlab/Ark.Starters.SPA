import { Button, Input, InputAddon, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

import type { InputHeaderWithClearProps } from "./chackraInputFilterWithClear";

export const ChackraInputHeaderFilterWithClear: React.FC<InputHeaderWithClearProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    setInputValue("");
    const event = {
      target: {
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    if (onChange) onChange(event);
  };

  return (
    <Stack>
      <Input size={"sm"} required={true} value={inputValue} onChange={handleChange} />
      {inputValue && (
        <InputAddon my={"-5px"}>
          <Button rounded={"full"} size="xs" onClick={handleClear}>
            <TiTimes />
          </Button>
        </InputAddon>
      )}
    </Stack>
  );
};
