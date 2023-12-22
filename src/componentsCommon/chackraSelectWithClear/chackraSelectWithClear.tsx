import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

interface SelectWithClearProps {
  handleInputChange: (name: string, value: string) => void;
  options: JSX.Element[];
  title: string;
  propName: string;
}

const ChackraSelectWithClear: React.FC<SelectWithClearProps> = ({
  handleInputChange,
  options,
  title,
  propName,
}) => {
  const [selectValue, setSelectValue] = useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    handleInputChange(propName, e.target.value);
  };

  const handleClear = () => {
    setSelectValue("");
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
        <Select isRequired={true} value={selectValue} onChange={handleChange}>
          {options}
        </Select>
        {selectValue && (
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

export default ChackraSelectWithClear;
