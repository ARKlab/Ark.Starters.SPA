import {
  Checkbox,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Input,
  RadioGroup,
} from "@chakra-ui/react";
import React from "react";
import { useField } from "react-final-form";
import { FieldInputProps } from "react-final-form";

export const FieldControl = ({
  name,
  ...rest
}: { name: string } & FormControlProps) => {
  const {
    meta: { error, touched, submitting },
  } = useField(name, {
    subscription: { touched: true, error: true, submitting: true },
  });
  return (
    <FormControl
      {...rest}
      isInvalid={error && touched}
      isDisabled={submitting}
    />
  );
};

export const FieldError = ({ name }: { name: string }) => {
  const {
    meta: { error },
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

export const InputControl = ({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: React.ReactNode;
  placeholder?: string;
}) => {
  const { input, meta } = useField(name);
  return (
    <FieldControl name={name} my={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...input}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={placeholder}
      />
      <FieldError name={name} />
    </FieldControl>
  );
};

export const CharkaCheckBoxFinalForm = ({
  label,
  name,
}: {
  label: string;
  name: string;
}) => {
  const { input, meta } = useField(name);
  return (
    <FormControl isInvalid={meta.error && meta.touched}>
      <Checkbox
        {...input}
        size="lg"
        isChecked={input.checked}
        onChange={input.onChange}
      >
        {label}
      </Checkbox>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
