import type { SelectContentProps, SelectRootProps, SelectTriggerProps } from "@chakra-ui/react";
import { createListCollection, Field, FieldLabel, Spinner, Stack, Text } from "@chakra-ui/react";

import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "./baseSelectSnippets";

export interface AppSelectOptionItem {
  label: string | React.JSX.Element;
  value: string;
  disabled?: boolean;
}

interface AppSelectProps {
  options: AppSelectOptionItem[];
  title?: string;
  isLoading?: boolean;
  onChange: (value: string | undefined) => void;
  value: string | undefined;
  triggerBg?: SelectTriggerProps["bg"];
  bg?: SelectContentProps["bg"];
  size?: SelectRootProps["size"];
  placeholder?: string;
  clearable?: boolean;
  zIndex?: SelectContentProps["zIndex"];
  disabled?: boolean;
  invalid?: boolean;
  fieldErrorText?: string;
  border?: SelectTriggerProps["border"];
  color?: SelectRootProps["color"];
}

//THE SELECT COMPONENT USED FOR THIS SUPPORTS MULTIPLE SELECTION. THIS IMPLEMENTATION ONLY SUPPORTS SINGLE SELECTION
// TO DO A SIMILAR COMPONENT THAT HANDLE ONLY MULTIPLE SELECTION
const AppSelect: React.FC<AppSelectProps> = ({
  options,
  title,
  onChange,
  value,
  isLoading,
  triggerBg,
  bg,
  size = "sm",
  placeholder = "",
  clearable = true,
  zIndex = "dropdown",
  disabled = false,
  invalid = false,
  fieldErrorText,
  border,
  color,
}) => {
  const optionCollection = createListCollection({ items: options });

  return (
    <Field.Root mr={title ? "0.5" : "0"} p={title ? "inherit" : "0"} m={title ? "inherit" : "0"} invalid={invalid}>
      {title && (
        <FieldLabel data-test="appselect-label">
          <Text as="b" data-test="appselect-title">
            {title}
          </Text>
        </FieldLabel>
      )}
      <Stack gap={title ? "inherit" : "0"} width="full">
        {isLoading ? (
          <Spinner data-test="appselect-loading" />
        ) : (
          <SelectRoot
            data-test="appselect-root-internal"
            disabled={disabled}
            layerStyle={disabled ? "disabled" : undefined}
            collection={optionCollection}
            size={size}
            onValueChange={e => {
              onChange(e.items[0] ? e.items[0].value : undefined);
            }}
            value={value ? [value] : undefined}
            color={color}
          >
            <SelectTrigger
              data-test="appselect-trigger"
              clearable={clearable}
              onClear={() => {
                onChange("");
              }}
              bg={triggerBg}
              rounded={"md"}
              border={border}
            >
              <SelectValueText placeholder={placeholder} data-test="appselect-value" />
            </SelectTrigger>
            <SelectContent data-test="appselect-content" bg={bg} zIndex={zIndex}>
              {optionCollection.items.map(x => (
                <SelectItem item={x} key={x.value} data-test={`appselect-item-${x.value}`}>
                  {x.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      </Stack>
      {fieldErrorText ? <Field.ErrorText data-test="appselect-error">{fieldErrorText}</Field.ErrorText> : null}
    </Field.Root>
  );
};

export default AppSelect;
