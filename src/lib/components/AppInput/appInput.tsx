import type { InputProps } from "@chakra-ui/react";
import { Field, FieldLabel, Input, Stack, Text } from "@chakra-ui/react";
import { LiaTimesSolid } from "react-icons/lia";

import { InputGroup } from "../../../components/ui/input-group";

interface InputWithClearProps {
  value: string | null;
  onChange: (v: string) => void;
  title: string;
  disabled?: boolean;
  isRequired?: boolean;
  fieldErrorText?: string;
  invalid?: boolean;
}
export interface InputHeaderWithClearProps extends InputProps {
  value: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const AppInput: React.FC<InputWithClearProps> = ({
  value,
  onChange,
  title,
  disabled,
  isRequired,
  fieldErrorText,
  invalid = false,
}) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <Field.Root invalid={invalid} data-test="appinput-root">
      <FieldLabel>
        <Text as="b" data-test="appinput-label">
          {title}
        </Text>
      </FieldLabel>
      <Stack w={"100%"}>
        <InputGroup
          endElementProps={{ _hover: { fontWeight: "bold", cursor: "pointer" }, color: "fg" }}
          endElement={value && <LiaTimesSolid onClick={handleClear} data-test="appinput-clear" />}
        >
          <Input
            data-test="appinput-input"
            value={value ?? ""}
            onChange={e => {
              onChange(e.target.value);
            }}
            disabled={disabled ?? false}
            required={isRequired ?? false}
          />
        </InputGroup>
      </Stack>
      {fieldErrorText ? <Field.ErrorText data-test="appinput-error">{fieldErrorText}</Field.ErrorText> : null}
    </Field.Root>
  );
};
