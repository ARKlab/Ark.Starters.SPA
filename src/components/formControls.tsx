 
import type {
  FormControlProps,
  InputProps
} from "@chakra-ui/react";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type FieldControlProps = {
  name: string;
  children: React.ReactNode;
} & FormControlProps;

export const FieldControl = (props: FieldControlProps) => {
  const {
    name,
    children,
    ...rest
  } = props;

  const {
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <FormControl
      {...rest}
      isInvalid={!!errors[name]}
      isDisabled={isSubmitting}
    >
      {children}
    </FormControl>
  );
};

type FieldErrorProps = {
  name: string
};

export const FieldError = ({ name }: FieldErrorProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  return <FormErrorMessage>{errors[name]?.message?.toString()}</FormErrorMessage>;
};

type InputControlProps = {
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  inputProps?: InputProps;
};

export const InputControl = (props: InputControlProps) => {
  const {
    name,
    label,
    placeholder,
    inputProps,
  } = props;

  const { control } = useFormContext();
  return (
    <FieldControl name={name}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input {...field} {...inputProps} id={name} placeholder={placeholder} />
        )}
      />
      <pre>{JSON.stringify(control, null, 2)}</pre>
      <FieldError name={name} />
    </FieldControl>
  );
};

type CheckboxControlProps = {
  label: string;
  name: string;
};

export const CheckboxControl = (props: CheckboxControlProps) => {
  const {
    label,
    name,
  } = props;

  const { control } = useFormContext();

  return (
    <FieldControl name={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            isChecked={field.value}
            onChange={(e) => { field.onChange(e.target.checked); }}
          >
            {label}
          </Checkbox>
        )}
      />
      <FieldError name={name} />
    </FieldControl>
  );
};
