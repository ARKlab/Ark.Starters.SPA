import type { InputProps } from "@chakra-ui/react"
import { Checkbox, Field, FieldLabel, Text } from "@chakra-ui/react"

interface CheckBoxProps {
  setChecked: (checked: boolean) => void
  checked: boolean
  label?: string
  title?: string
  disabled?: boolean
  fieldErrorText?: string
  invalid?: boolean
}
export interface InputHeaderWithClearProps extends InputProps {
  value: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const AppCheckBox: React.FC<CheckBoxProps> = ({
  setChecked,
  label,
  title,
  checked,
  fieldErrorText,
  disabled = false,
  invalid = false,
}) => {
  return (
    <Field.Root invalid={invalid} data-test="checkbox-root">
      {title && (
        <FieldLabel data-test="checkbox-title">
          <Text as="b">{title}</Text>
        </FieldLabel>
      )}
      <Checkbox.Root
        disabled={disabled}
        size={"lg"}
        checked={checked}
        onCheckedChange={e => {
          setChecked(!!e.checked)
        }}
        data-test="checkbox-control"
      >
        <Checkbox.HiddenInput data-test="checkbox-hidden-input" />
        <Checkbox.Control data-test="checkbox-visual">
          <Checkbox.Indicator color="brand.fg" data-test="checkbox-indicator" />
        </Checkbox.Control>
        <Checkbox.Label data-test="checkbox-label">{label ?? ""}</Checkbox.Label>
      </Checkbox.Root>
      {fieldErrorText ? (
        <Field.ErrorText data-test="checkbox-error">{fieldErrorText}</Field.ErrorText>
      ) : null}
    </Field.Root>
  )
}
