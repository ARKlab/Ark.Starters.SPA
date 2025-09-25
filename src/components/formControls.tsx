import type { InputProps } from "@chakra-ui/react";
import { Field, FieldLabel, Input } from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "./ui/checkbox";

type FieldControlProps = {
  name: string;
  children: React.ReactNode;
};

export const FieldControl = (props: FieldControlProps) => {
  const { name, children, ...rest } = props;

  const {
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <Field.Root {...rest} invalid={!!errors[name]} disabled={isSubmitting}>
      {children}
    </Field.Root>
  );
};

type FieldErrorProps = {
  name: string;
};

export const FieldError = ({ name }: FieldErrorProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  return <Field.ErrorText>{errors[name]?.message as string}</Field.ErrorText>;
};

type InputControlProps = {
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  inputProps?: InputProps;
};

export const InputControl = (props: InputControlProps) => {
  const { name, label, placeholder, inputProps } = props;

  const { control } = useFormContext();
  return (
    <FieldControl name={name}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Input {...field} {...inputProps} id={name} placeholder={placeholder} />}
      />
      <FieldError name={name} />
    </FieldControl>
  );
};

type CheckboxControlProps = {
  label: string;
  name: string;
};

export const CheckboxControl = (props: CheckboxControlProps) => {
  const { label, name } = props;

  const { control } = useFormContext();

  return (
    <FieldControl name={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            checked={field.value}
            onChange={e => {
              field.onChange(e.target);
            }}
          >
            {label}
          </Checkbox>
        )}
      />
      <FieldError name={name} />
    </FieldControl>
  );
};
