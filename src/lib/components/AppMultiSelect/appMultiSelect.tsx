import { FieldLabel } from "@ark-ui/react"
import {
  createListCollection,
  Portal,
  Select,
  Spinner,
  Text,
  type SelectValueChangeDetails,
} from "@chakra-ui/react"

export interface Item {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: Item[] | null
  title?: string
  onChange: (value: string[]) => void
  value: string[] | null
  placeholder?: string
  lazyMount?: boolean // Optional prop to control lazy mounting
  isLoading?: boolean // Optional prop to show a loading state
}

const AppMultiSelect: React.FC<MultiSelectProps> = ({
  options,
  title,
  onChange,
  value,
  placeholder,
  lazyMount = false, // Default to false if not provided
  isLoading = false, // Default to false if not provided
}) => {
  const optionCollection = createListCollection({ items: options ?? [] })

  function handleValueChange(value: SelectValueChangeDetails<Item>) {
    onChange(value.items.map(item => item.value))
  }

  return (
    <Select.Root
      multiple
      collection={optionCollection}
      width="full"
      value={value ?? []}
      onValueChange={handleValueChange}
      lazyMount={lazyMount}
      data-test="appmultiselect-root"
    >
      <Select.HiddenSelect />
      {title && (
        <FieldLabel asChild>
          <Text as="b" data-test="appmultiselect-title">
            {title}
          </Text>
        </FieldLabel>
      )}
      <Select.Control data-test="appmultiselect-control">
        <Select.Trigger data-test="appmultiselect-trigger">
          <Select.ValueText
            placeholder={placeholder ?? "Select a value..."}
            data-test="appmultiselect-value"
          />
          {isLoading && <Spinner size="sm" data-test="appmultiselect-loading-indicator" />}
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator data-test="appmultiselect-indicator" />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner data-test="appmultiselect-positioner">
          <Select.Content zIndex="max" bg="bg" data-test="appmultiselect-content" data-state="open">
            {optionCollection.items.map(option => (
              <Select.Item
                item={option}
                key={option.value}
                data-test={`appmultiselect-item-${option.value}`}
              >
                {option.label}
                <Select.ItemIndicator data-test={`appmultiselect-item-indicator-${option.value}`} />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

export default AppMultiSelect
