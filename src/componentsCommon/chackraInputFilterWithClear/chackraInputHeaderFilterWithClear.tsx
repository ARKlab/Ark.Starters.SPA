import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";
import { InputHeaderWithClearProps } from "./chackraInputFilterWithClear";

export const ChackraInputHeaderFilterWithClear: React.FC<
  InputHeaderWithClearProps
> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  const handleClear = () => {
    setInputValue("");
    const event = {
      target: {
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange && onChange(event);
  };

  return (
    <InputGroup>
      <Input
        size={"sm"}
        isRequired={true}
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <InputRightElement my={"-5px"}>
          <Button rounded={"full"} size="xs" onClick={handleClear}>
            <TiTimes />
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
