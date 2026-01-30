/* eslint-disable  */
import { parseDate } from "@ark-ui/react/date-picker"
import { Box, Field, FieldLabel, HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import { addDays } from "date-fns"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { LuX } from "react-icons/lu"

import { AppDatePicker } from "../AppDatePicker/appDatePicker"

interface AppDateRangeProps {
  label: string
  range: Date[]
  setRange: (range: Date[]) => void
  isInclusive?: boolean
  timeZone?: string
  disabled?: boolean
  dateFormat?: string
  dateDisplayFormat?: string
}

export const AppDateRange = (props: AppDateRangeProps) => {
  const { t } = useTranslation()

  const {
    label,
    range,
    setRange,
    isInclusive = true,
    timeZone = "CET",
    disabled,
    dateFormat = "yyyy-MM-dd",
    dateDisplayFormat = "dd/MM/yyyy",
  } = props

  let from: Date | null = range[0] ?? null
  const toStored: Date | null = range[1] ?? null
  const toVisible = toStored ? (isInclusive ? toStored : addDays(toStored, -1)) : null

  const handleFromChange = (d: Date | undefined) => {
    if (!d) {
      setRange([])
      return
    }
    const newFrom = d
    const currentTo = toStored
    if (currentTo && currentTo < newFrom) {
      setRange([newFrom, newFrom])
    } else {
      setRange(currentTo ? [newFrom, currentTo] : [newFrom])
    }
  }

  const handleToChange = (d: Date | undefined) => {
    if (!d) {
      setRange(from ? [from] : [])
      return
    }
    let newTo = d
    let currentFrom = from

    if (currentFrom != null && newTo < currentFrom) {
      currentFrom = newTo
    }
    const storedTo = isInclusive ? newTo : addDays(newTo, 1)

    setRange(currentFrom ? [currentFrom, storedTo] : [newTo, storedTo])
  }

  const clear = () => {
    setRange([])
  }

  const effectiveMaxForFrom = toVisible ?? undefined
  const minForTo = from ?? undefined

  const datePickerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <Stack ref={datePickerRef} data-test="daterange">
      <Field.Root>
        <FieldLabel>
          <Text as="b" data-test="daterange-label">
            {label}
          </Text>
        </FieldLabel>
        <HStack gap={"2"} alignItems="flex-end" data-test="daterange-inputs">
          <Box flex="1" data-test="daterange-from">
            <AppDatePicker
              label={t("libComponents:appDateRange_from")}
              date={from}
              maxDate={effectiveMaxForFrom}
              setDate={handleFromChange}
              timeZone={timeZone}
              showCalendarButton={false}
              disabled={disabled}
              dateFormat={dateFormat}
              dateDisplayFormat={dateDisplayFormat}
              showClearButton={false}
            />
          </Box>
          <Box flex="1" data-test="daterange-to">
            <AppDatePicker
              label={t("libComponents:appDateRange_to")}
              date={toVisible}
              minDate={minForTo}
              setDate={handleToChange}
              timeZone={timeZone}
              showCalendarButton={false}
              defaultFocusedValue={
                minForTo
                  ? parseDate(t("{{val, dateFormat}}", { val: minForTo, format: dateFormat }))
                  : undefined
              }
              disabled={disabled}
              dateFormat={dateFormat}
              dateDisplayFormat={dateDisplayFormat}
              showClearButton={false}
            />
          </Box>
          {range.length > 0 ? (
            <IconButton
              aria-label="Clear date range"
              onClick={clear}
              variant="outline"
              data-test="daterange-clear"
            >
              <LuX />
            </IconButton>
          ) : null}
        </HStack>
        <HStack mt={"1"} fontSize="xs" color="gray.500" data-test="daterange-display">
          <Text>
            {from ? t("{{val, dateFormat}}", { val: from, format: dateDisplayFormat }) : ""}
            {from || toStored ? " - " : ""}
            {toVisible
              ? t("{{val, dateFormat}}", { val: toVisible, format: dateDisplayFormat })
              : ""}
          </Text>
        </HStack>
      </Field.Root>
    </Stack>
  )
}
