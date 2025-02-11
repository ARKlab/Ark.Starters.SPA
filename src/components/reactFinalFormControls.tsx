import type {
  FieldPropsProvider
} from "@chakra-ui/react";
import {
  Input
} from "@chakra-ui/react";
import React from "react";
import type { UseFieldConfig } from "react-final-form";
import { useField } from "react-final-form";

import { Checkbox } from "./ui/checkbox";
import { Field } from "./ui/field";

export const FieldControl = ({
  name,
  ...rest
}: { name: string } & typeof FieldPropsProvider) => {
  const {
    meta: { error, touched, submitting },
  } = useField(name, {
    subscription: { touched: true, error: true, submitting: true },
  });
  return (
    <Field
      {...rest}
      invalid={!!error && touched}
      disabled={submitting}
    />
  );
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
  const {
    input,
    meta: { error, touched },
  } = useField(name, rest);

  const isInvalid = touched && !!error;

  return (
    <Field label={label} invalid={isInvalid} errorText={isInvalid ? error : undefined}>
      <Input {...input} id={name} placeholder={placeholder} />
    </Field>
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
    <Field invalid={meta.error && meta.touched} errorText={meta.error}>
      <Checkbox
        {...input}
        size="md"
        checked={input.checked}
        onChange={input.onChange}
      >
        {label}
      </Checkbox>
    </Field>
  );
};
