import type {
  FormControlProps
} from "@chakra-ui/react";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/react";
import React from "react";
import type { UseFieldConfig } from "react-final-form";
import { useField } from "react-final-form";

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
      isInvalid={!!error && touched}
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
  ...rest
}: {
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
} & UseFieldConfig<string>) => {
  const { input } = useField(name, rest);
  return (
    <FieldControl name={name}>
      {(label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null)}
      <Input
        {...input}
        id={name}
        placeholder={placeholder}
      />
      <FieldError name={name} />
    </FieldControl >
  );
};

export const CheckboxControl = ({
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
        size="md"
        isChecked={input.checked}
        onChange={input.onChange}
      >
        {label}
      </Checkbox>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
