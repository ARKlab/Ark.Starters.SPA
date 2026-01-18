/* eslint-disable*/
import { Field, Input, Stack, Text } from "@chakra-ui/react";

import { InputGroup } from "../../../components/ui/input-group";

import { LuX } from "react-icons/lu";

interface AppInputFilterProps {
  value: string;
  handleInputChange: (name: string, value: string) => void;
  title: string;
  propName: string;
  disabled?: boolean;
  isRequired?: boolean;
}

export const AppInputFilter: React.FC<AppInputFilterProps> = ({
  value,
  handleInputChange,
  title,
  propName,
  disabled,
  isRequired,
}) => {
  const handleClear = () => {
    handleInputChange(propName, "");
  };

  return (
    <Field.Root mr={title ? "0.5" : "0"} p={title ? "inherit" : "0"} m={title ? "inherit" : "0"}>
      <Text as="b">{title}</Text>

      <Stack w={"full"}>
        <InputGroup
          endElementProps={{ _hover: { fontWeight: "bold", cursor: "checkbox" }, color: "fg" }}
          endElement={value && <LuX onClick={handleClear} />}
        >
          <Input
            size={"sm"}
            value={value}
            onChange={e => handleInputChange(propName, e.target.value)}
            disabled={disabled ?? false}
            required={isRequired ?? false}
          />
        </InputGroup>
      </Stack>
    </Field.Root>
  );
};
