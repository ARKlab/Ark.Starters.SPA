"use client";

import {
  Button,
  Spinner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  createListCollection,
  Icon,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { TiTimes } from "react-icons/ti";

import { Field } from "../ui/field";
import { InputGroup } from "../ui/input-group";

interface Option {
  label: string;
  value: string;
}

interface SelectWithClearProps {
  handleInputChange: (name: string, value: string[]) => void;
  options: Option[];
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
  const [selectValue, setSelectValue] = useState<string[]>([]);

  const collection = useMemo(() => {
    return createListCollection({
      items: options,
      itemToString: item => item.label,
      itemToValue: item => item.value,
    });
  }, [options]);

  const handleChange = (details: { value: string[] }) => {
    setSelectValue(details.value);
    handleInputChange(propName, details.value);
  };

  const handleClear = () => {
    setSelectValue([]);
    handleInputChange(propName, []);
  };

  return (
    <Field mr="2%" title={title}>
      <InputGroup
        endElement={
          selectValue.length > 0 ? (
            <Button rounded={"full"} h="1rem" size="xs" onClick={handleClear}>
              <TiTimes />
            </Button>
          ) : null
        }
      >
        <SelectRoot collection={collection} value={selectValue} onValueChange={handleChange} size="sm">
          <Icon>{isLoading ? <Spinner data-role="spinner" /> : <MdArrowDropDown />}</Icon>
          <SelectTrigger>
            <SelectValueText placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {collection.items.map(item => (
              <SelectItem key={item.value} item={item}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </InputGroup>
    </Field>
  );
};

export default ChackraSelectWithClear;
