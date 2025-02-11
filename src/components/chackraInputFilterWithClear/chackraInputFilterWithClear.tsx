import type {
  InputProps
} from "@chakra-ui/react";
import {
  Button,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

import { Field } from "../ui/field";

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
    <Field label={title} mr="2%">
      <HStack>
        <Input required={true} value={inputValue} onChange={handleChange} />
        {inputValue && (
          <Input>
            <Button rounded={"full"} h="1rem" size="xs" onClick={handleClear}>
              <TiTimes />
            </Button>
          </Input>
        )}
      </HStack>
    </Field>
  );
};
