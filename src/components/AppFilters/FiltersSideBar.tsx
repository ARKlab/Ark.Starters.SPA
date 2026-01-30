import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Field,
  Icon,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useId, useState } from "react"
import { useTranslation } from "react-i18next"
import { LuCheck, LuX } from "react-icons/lu"

import { AppInput } from "../../lib/components/AppInput/appInput"
import AppSelect from "../../lib/components/AppSelect/appSelect"

import type { FilterDefinition } from "./Filters"

interface FilterSidebarProps<T extends object> {
  isOpen: boolean
  onClose: () => void
  filters?: Partial<T>
  filterDefinitions: FilterDefinition<T>[]
  onApplyFilter: (filter: Partial<T>) => void
}

export function FilterSidebar<T extends object>(props: FilterSidebarProps<T>) {
  const { isOpen, onClose, filters, filterDefinitions } = props

  const formId = useId()

  const { t } = useTranslation()

  const [localValues, setLocalValues] = useState<Partial<T>>(filters ?? {})

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValues(filters ?? {})
  }, [filters])

  function applyFilters() {
    props.onApplyFilter(localValues)
  }

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={_ => {
        onClose()
      }}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner padding="4">
          <Drawer.Content rounded="md" bg="bg.panel">
            <Drawer.Header>
              <Drawer.Title>{t("common.filters")}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack
                gap="6"
                align="stretch"
                as={"form"}
                id={formId}
                onSubmit={e => {
                  e.preventDefault()
                  applyFilters()
                }}
              >
                {filterDefinitions.map(filter => {
                  return (
                    <Box key={filter.id}>
                      <Text fontWeight="medium" mb="2" fontSize="sm" color="fg.muted">
                        {filter.label}
                      </Text>

                      {filter.type === "text" && (
                        <AppInputFilterWrapper
                          placeholder={filter.placeholder}
                          value={String(localValues[filter.propName] ?? "")}
                          filterLabel={""}
                          setValue={e => {
                            setLocalValues(prev => ({ ...prev, [filter.id]: e }))
                          }}
                        />
                      )}
                      {filter.type === "select" && (
                        <Field.Root>
                          <AppSelect
                            placeholder={
                              filter.placeholder ?? `Cerca ${filter.label?.toLowerCase() ?? ""}...`
                            }
                            value={localValues[filter.propName] as string}
                            onChange={value => {
                              setLocalValues(prev => ({
                                ...prev,
                                [filter.id]: value ?? undefined,
                              }))
                            }}
                            options={filter.collection}
                          />
                          {filter.hint?.length && (
                            <Field.HelperText fontSize="xs" fontWeight="medium">
                              {filter.hint}
                            </Field.HelperText>
                          )}
                        </Field.Root>
                      )}
                      {/* Additional filter types can be handled here using AppComponents in /src/lib/components directory */}
                    </Box>
                  )
                })}
              </VStack>
            </Drawer.Body>

            <Drawer.Footer>
              <Button variant="outline" onClick={onClose}>
                <Icon as={LuX} />
                {t("common.close")}
              </Button>

              <Button
                type="submit"
                form={formId}
                size="sm"
                fontWeight="semibold"
                _hover={{
                  bg: "brand.focusRing",
                }}
              >
                <Icon as={LuCheck} />
                {t("common.apply")}
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

function AppInputFilterWrapper({
  placeholder,
  filterLabel,
  value,
  setValue,
}: {
  placeholder?: string
  value?: string
  filterLabel: string
  setValue: (a: string) => void
}) {
  function handleChange(nextValue: string) {
    setValue(nextValue)
  }

  return (
    <Field.Root>
      <AppInput
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
        title={filterLabel}
      />
    </Field.Root>
  )
}
