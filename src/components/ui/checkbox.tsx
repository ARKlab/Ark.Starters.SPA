import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import * as React from "react";

export interface CheckboxProps extends Omit<ChakraCheckbox.RootProps, 'checked'> {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
  indeterminate?: boolean;
  checked?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const { icon, children, inputProps, rootRef, indeterminate, checked, ...rest } = props;
  
  return (
    <ChakraCheckbox.Root 
      ref={rootRef} 
      checked={indeterminate ? "indeterminate" : checked} 
      {...rest}
    >
      <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
      <ChakraCheckbox.Control>{icon ?? <ChakraCheckbox.Indicator />}</ChakraCheckbox.Control>
      {children != null && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
    </ChakraCheckbox.Root>
  );
});
