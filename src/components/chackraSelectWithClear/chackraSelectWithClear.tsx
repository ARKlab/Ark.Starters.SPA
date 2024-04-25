import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { TiTimes } from "react-icons/ti";

interface SelectWithClearProps {
  handleInputChange: (name: string, value: string) => void;
  options: JSX.Element[];
  title: string;
  propName: string;
  isLoading?: boolean;
}

const ChackraSelectWithClear: React.FC<SelectWithClearProps> = ({
  handleInputChange,
  options,
  title,
  propName,
  isLoading,
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
        <Select
          isRequired={true}
          value={selectValue}
          onChange={handleChange}
          icon={isLoading ? <Spinner /> : <MdArrowDropDown />}
        >
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
