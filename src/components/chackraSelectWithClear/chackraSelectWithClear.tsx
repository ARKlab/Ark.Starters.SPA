import { createListCollection, Field, FieldLabel, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";

export interface Item {
  label: string;
  value: string;
  disabled?: boolean;
}
interface SelectWithClearProps {
  handleInputChange: (name: string, value: string) => void;
  options: Item[];
  title: string;
  propName: string;
  isLoading?: boolean;
}

//THE SELECT COMPONENT USED FOR THIS SUPPORTS MULTIPLE SELECTION. THIS IMPLEMENTATION ONLY SUPPORTS SINGLE SELECTION
// TO DO A SIMILAR COMPONENT THAT HANDLE ONLY MULTIPLE SELECTION
const ChackraSelectWithClear: React.FC<SelectWithClearProps> = ({
  handleInputChange,
  options,
  title,
  propName,
  isLoading,
}) => {
  const [selectValue, setSelectValue] = useState<string>();

  const handleChange = (items: Item[]) => {
    if (items.length === 0) {
      setSelectValue("");
      handleInputChange(propName, "");
      return;
    }
    setSelectValue(items[0].value);
    handleInputChange(propName, items[0].value);
  };

  const optionCollection = createListCollection({ items: options });
  return (
    <Field.Root mr="2%">
      <FieldLabel>
        <Text color="brand.dark" as="b">
          {title}
        </Text>
      </FieldLabel>
      <Stack>
        {isLoading ? (
          <Spinner />
        ) : (
          <SelectRoot
            collection={optionCollection}
            size="sm"
            width="320px"
            onValueChange={e => {
              handleChange(e.items);
            }}
            value={selectValue ? [selectValue] : undefined}
          >
            <SelectTrigger clearable>
              <SelectValueText />
            </SelectTrigger>
            <SelectContent>
              {optionCollection.items.map(x => (
                <SelectItem item={x} key={x.value}>
                  {x.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      </Stack>
    </Field.Root>
  );
};

export default ChackraSelectWithClear;
