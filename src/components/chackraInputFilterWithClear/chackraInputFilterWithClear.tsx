import type { InputProps } from "@chakra-ui/react";
import { Button, Field, FieldLabel, Input, InputAddon, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

interface InputWithClearProps {
  value: string;
  handleInputChange: (name: string, value: string) => void;
  title: string;
  propName: string;
}
export interface InputHeaderWithClearProps extends InputProps {
  value: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const ChackraInputFilterWithClear: React.FC<InputWithClearProps> = ({
  value,
  handleInputChange,
  title,
  propName,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleInputChange(propName, e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    handleInputChange(propName, "");
  };

  return (
    <Field.Root>
      <FieldLabel>
        <Text as="b">{title}</Text>
      </FieldLabel>
      <Stack>
        <Input required={true} value={inputValue} onChange={handleChange} />
        {inputValue && (
          <InputAddon>
            <Button rounded={"full"} h="1rem" size="xs" onClick={handleClear}>
              <TiTimes />
            </Button>
          </InputAddon>
        )}
      </Stack>
    </Field.Root>
  );
};
