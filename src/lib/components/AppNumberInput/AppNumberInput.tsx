"use client";

import type { InputProps, TextProps } from "@chakra-ui/react";
import { Field, FieldLabel, Input, Stack, Text } from "@chakra-ui/react";
import { useRef } from "react";

import { InputGroup } from "../../../components/ui/input-group";

interface InputWithClearProps {
  value: number | undefined;
  setValue: (value: number | undefined) => void;
  title?: string;
  width?: Field.RootProps["width"];
  invalid?: boolean;
  fieldErrorText?: string;
  noPadding?: boolean;
  fontSize?: TextProps["fontSize"];
  inputSize?: InputProps["size"];
}

export const AppNumberInput: React.FC<InputWithClearProps> = ({
  value,
  setValue,
  title,
  width,
  fieldErrorText,
  invalid,
  noPadding,
  fontSize = "xs",
  inputSize = "sm",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <>
      <Field.Root
        data-test="appnumberinput-root"
        mr={title ? "0.5" : "0"}
        p={noPadding ? "0" : title ? "inherit" : "0"}
        m={title ? "inherit" : "0"}
        width={width}
        invalid={invalid}
      >
        {title && (
          <FieldLabel data-test="appnumberinput-label">
            <Text as="b" fontSize={fontSize}>
              {title}
            </Text>
          </FieldLabel>
        )}
        <Stack gap={title ? "2" : "0"} width="full">
          <InputGroup>
            <Input
              data-test="appnumberinput-input"
              ref={inputRef}
              required
              value={value ?? ""}
              onChange={handleChange}
              type="number"
              size={inputSize}
            />
          </InputGroup>
        </Stack>
        {fieldErrorText ? (
          <Field.ErrorText data-test="appnumberinput-error">{fieldErrorText}</Field.ErrorText>
        ) : null}
      </Field.Root>
    </>
  );
};
