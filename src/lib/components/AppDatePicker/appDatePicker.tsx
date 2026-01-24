import type { DateValue } from "@ark-ui/react/date-picker";
import { DatePicker, parseDate, useDatePicker } from "@ark-ui/react/date-picker";
import type { StackProps } from "@chakra-ui/react";
import { Box, Button, Field, FieldLabel, HStack, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuX, LuCalendar, LuCalendarOff, LuChevronLeft, LuChevronRight } from "react-icons/lu";

import "./appDatePicker.css";

interface AppDatePickerProps extends DatePicker.RootProps {
  date: Date | null;
  minDate?: Date;
  maxDate?: Date;
  setDate: (date: Date | undefined) => void; // CONSENTE undefined per il clear
  label?: string;
  fieldErrorText?: string;
  invalid?: boolean;
  w?: StackProps["w"];
  border?: StackProps["border"];
  bg?: StackProps["bg"];
  inputSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined;
  timeZone?: string;
  showCalendarButton?: boolean;
  defaultFocusedValue?: DateValue;
  dateFormat?: string;
  dateDisplayFormat?: string;
  showClearButton?: boolean;
}
export const AppDatePicker = (props: AppDatePickerProps) => {
  const { t, i18n } = useTranslation();

  const {
    date,
    minDate,
    maxDate,
    setDate,
    label,
    fieldErrorText,
    inputSize,
    invalid,
    bg,
    w,
    border,
    timeZone,
    showCalendarButton = true,
    defaultFocusedValue,
    dateFormat = "yyyy-MM-dd",
    dateDisplayFormat = "dd/MM/yyyy",
    showClearButton = true,
  } = props;

  const parsedValue = useMemo(() => {
    if (!date) return undefined;
    try {
      // dateFormat is typically "yyyy-MM-dd" for parseDate
      const formatted =
        dateFormat === "yyyy-MM-dd"
          ? t("{{val, isoDate}}", { val: date })
          : t("{{val, dateFormat}}", { val: date, format: dateFormat });
      return parseDate(formatted);
    } catch {
      return undefined;
    }
  }, [date, dateFormat, t]);

  const [open, setOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  function onValueChange(details: DatePicker.ValueChangeDetails) {
    if (details.value.length > 0) {
      const picked = details.value[0];
      setDate(picked.toDate(timeZone ?? "UTC"));
      setOpen(false);
    } else {
      setDate(undefined);
    }
  }

  function getFormat(dv: DateValue) {
    const d = dv.toDate(timeZone ?? "UTC");
    return t("{{val, dateFormat}}", { val: d, format: dateDisplayFormat });
  }

  const min = minDate
    ? parseDate(
        dateFormat === "yyyy-MM-dd"
          ? t("{{val, isoDate}}", { val: minDate })
          : t("{{val, dateFormat}}", { val: minDate, format: dateFormat }),
      )
    : undefined;
  const max = maxDate
    ? parseDate(
        dateFormat === "yyyy-MM-dd"
          ? t("{{val, isoDate}}", { val: maxDate })
          : t("{{val, dateFormat}}", { val: maxDate, format: dateFormat }),
      )
    : undefined;

  const datePicker = useDatePicker({
    positioning: { sameWidth: true, placement: "bottom-start", overlap: true, strategy: "fixed" },
    startOfWeek: 1,
    numOfMonths: 1,
    onValueChange,
    value: parsedValue ? [parsedValue] : [],
    open,
    min,
    max,
    format: getFormat,
    locale: i18n.language,
    onOpenChange: details => {
      setOpen(details.open);
    },
  });

  useEffect(() => {
    if (!date && defaultFocusedValue) datePicker.setFocusedValue(defaultFocusedValue);
  }, [date, defaultFocusedValue, datePicker]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Stack ref={datePickerRef} w={w ?? undefined} data-test="datepicker">
      <Field.Root invalid={invalid}>
        {label && (
          <FieldLabel>
            <Text as="b" data-test="datepicker-label">
              {label}
            </Text>
          </FieldLabel>
        )}
        <DatePicker.RootProvider
          value={datePicker}
          onKeyDown={e => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <DatePicker.Control data-test="datepicker-control">
            <HStack gap={"2"}>
              <DatePicker.Input index={0} asChild>
                <Input
                  data-test="datepicker-input"
                  bg={bg}
                  onClick={() => {
                    setOpen(true);
                  }}
                  placeholder={
                    parsedValue
                      ? t("{{val, dateFormat}}", {
                          val: parsedValue.toDate(timeZone ?? "UTC"),
                          format: dateDisplayFormat,
                        })
                      : ""
                  }
                  border={border}
                  size={inputSize ?? "md"}
                  value={parsedValue ? getFormat(parsedValue) : ""}
                  readOnly
                />
              </DatePicker.Input>
              {showCalendarButton ? (
                <DatePicker.Trigger asChild>
                  <IconButton
                    data-test="datepicker-trigger"
                    size={inputSize ?? "md"}
                    aria-label={t("libComponents:appDatePicker_openDatePicker")}
                    onClick={() => {
                      setOpen(o => !o);
                    }}
                  >
                    {open ? <LuCalendarOff /> : <LuCalendar />}
                  </IconButton>
                </DatePicker.Trigger>
              ) : null}
              {showClearButton && date ? (
                <IconButton
                  data-test="datepicker-clear"
                  size={inputSize ?? "md"}
                  aria-label={t("libComponents:appDatePicker_clearDatePicker")}
                  onClick={() => {
                    setDate(undefined);
                  }}
                >
                  <LuX />
                </IconButton>
              ) : null}
            </HStack>
          </DatePicker.Control>
          <DatePicker.Positioner>
            <DatePicker.Content data-test="datepicker-content">
              <DatePicker.View view="day">
                <DatePicker.Context>
                  {api => (
                    <>
                      <DatePicker.ViewControl data-test="datepicker-nav">
                        <DatePicker.PrevTrigger asChild>
                          <IconButton variant="ghost" size="sm" data-test="datepicker-prev-month">
                            <LuChevronLeft />
                          </IconButton>
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger asChild>
                          <Button variant="ghost" size="sm" data-test="datepicker-month-label">
                            <DatePicker.RangeText />
                          </Button>
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <LuChevronRight />
                          </IconButton>
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table>
                        <DatePicker.TableHead>
                          <DatePicker.TableRow>
                            {api.weekDays.map((weekDay, id) => (
                              <DatePicker.TableHeader key={id}>{weekDay.narrow}</DatePicker.TableHeader>
                            ))}
                          </DatePicker.TableRow>
                        </DatePicker.TableHead>
                        <DatePicker.TableBody>
                          {api.weeks.map((week, id) => (
                            <DatePicker.TableRow key={id}>
                              {week.map((day, id) => (
                                <DatePicker.TableCell key={id} value={day}>
                                  <DatePicker.TableCellTrigger asChild>
                                    <Box
                                      data-test={`datepicker-day-${day.day}`}
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      width="8"
                                      height="8"
                                      borderRadius="md"
                                      _hover={{ bg: "brand.subtle" }}
                                    >
                                      {day.day}
                                    </Box>
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
              <DatePicker.View view="month">
                <DatePicker.Context>
                  {api => (
                    <>
                      <DatePicker.ViewControl>
                        <DatePicker.PrevTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <LuChevronLeft />
                          </IconButton>
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <DatePicker.RangeText />
                          </Button>
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <LuChevronRight />
                          </IconButton>
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>

                      <DatePicker.Table>
                        <DatePicker.TableBody>
                          {api.getMonthsGrid({ columns: 4, format: "short" }).map((months, id) => (
                            <DatePicker.TableRow key={id}>
                              {months.map((month, id) => (
                                <DatePicker.TableCell key={id} value={month.value}>
                                  <DatePicker.TableCellTrigger asChild>
                                    <Button variant="ghost">{month.label}</Button>
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
              <DatePicker.View view="year">
                <DatePicker.Context>
                  {api => (
                    <>
                      <DatePicker.ViewControl>
                        <DatePicker.PrevTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <LuChevronLeft />
                          </IconButton>
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <DatePicker.RangeText />
                          </Button>
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <LuChevronRight />
                          </IconButton>
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table>
                        <DatePicker.TableBody>
                          {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                            <DatePicker.TableRow key={id}>
                              {years.map((year, id) => (
                                <DatePicker.TableCell key={id} value={year.value}>
                                  <DatePicker.TableCellTrigger asChild>
                                    <Button variant="ghost">{year.label}</Button>
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </DatePicker.RootProvider>
        {fieldErrorText ? <Field.ErrorText data-test="datepicker-error">{fieldErrorText}</Field.ErrorText> : null}
      </Field.Root>
    </Stack>
  );
};
