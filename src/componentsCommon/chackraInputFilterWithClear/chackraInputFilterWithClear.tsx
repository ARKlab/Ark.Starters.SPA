import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
  InputRightElement,
  InputProps,
} from "@chakra-ui/react";
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
    <FormControl mr="2%">
      <FormLabel>
        <Text color="brand.dark" as="b">
          {title}
        </Text>
      </FormLabel>
      <InputGroup>
        <Input isRequired={true} value={inputValue} onChange={handleChange} />
        {inputValue && (
          <InputRightElement>
            <Button rounded={"full"} h="1rem" size="xs" onClick={handleClear}>
              <TiTimes />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};
