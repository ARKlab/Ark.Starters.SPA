import type { DateValue } from "@ark-ui/react/date-picker";
import { DatePicker, parseDate, useDatePicker } from "@ark-ui/react/date-picker";
import { Box, Button, Field, FieldLabel, HStack, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { LuCalendar, LuCalendarOff } from "react-icons/lu";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import "./appDatePicker.css";

interface AppDatePickerProps extends DatePicker.RootProps {
  date: Date | null;
  minDate?: Date;
  maxDate?: Date;
  setDate: (date: Date | undefined) => void; // CONSENTE undefined per il clear
  label?: string;
  fieldErrorText?: string;
  invalid?: boolean;
  w?: string;
  border?: string;
  bg?: string;
  inputSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined;
  timeZone?: string;
  showCalendarButton?: boolean;
  defaultFocusedValue?: DateValue;
  dateFormat?: string;
  dateDisplayFormat?: string;
  locale?: string;
  showClearButton?: boolean;
}

export const AppDatePicker = (props: AppDatePickerProps) => {
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
    locale = "en-GB",
    showClearButton = true,
  } = props;
  // ATTENZIONE: parseDate accetta stringa (YYYY-MM-DD), non Date.
  const [value, setValue] = useState<DateValue | undefined>(date ? parseDate(format(date, dateFormat)) : undefined);
  const [open, setOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [clearButtonVisible, setClearButtonVisible] = useState(false);
  useEffect(() => {
    if (!date) {
      setValue(undefined);
      setClearButtonVisible(false);
      return;
    }
    setClearButtonVisible(true);
    try {
      setValue(parseDate(format(date, dateFormat)));
    } catch {
      setValue(undefined);
    }
  }, [date, dateFormat]);

  function onValueChange(details: DatePicker.ValueChangeDetails) {
    if (details.value.length > 0) {
      const picked = details.value[0];
      setValue(picked);
      setDate(picked.toDate(timeZone ?? "UTC"));
      setOpen(false);
    } else {
      setValue(undefined);
      setDate(undefined);
    }
  }

  function getFormat(dv: DateValue, _details: { locale: string }) {
    const d = dv.toDate(timeZone ?? "UTC");
    return format(d, dateDisplayFormat);
  }

  const min = minDate ? parseDate(format(minDate, dateFormat)) : undefined;
  const max = maxDate ? parseDate(format(maxDate, dateFormat)) : undefined;

  const datePicker = useDatePicker({
    positioning: { sameWidth: true, placement: "bottom-start", overlap: true, strategy: "fixed" },
    startOfWeek: 1,
    numOfMonths: 1,
    onValueChange,
    value: date && value ? [value] : undefined,
    open,
    min,
    max,
    format: getFormat,
    locale: locale,
    onOpenChange: details => {
      setOpen(details.open);
    },
  });

  useEffect(() => {
    if (!date && defaultFocusedValue) datePicker.setFocusedValue(defaultFocusedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, defaultFocusedValue]);
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
    <Stack ref={datePickerRef} w={w ?? ""} data-test="datepicker">
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
                  placeholder={date && value ? format(value.toDate(timeZone ?? "UTC"), dateDisplayFormat) : ""}
                  borderWidth={border}
                  size={inputSize ?? "md"}
                  value={date && value ? getFormat(value, { locale: locale }) : ""}
                  readOnly
                />
              </DatePicker.Input>
              {showCalendarButton ? (
                <DatePicker.Trigger asChild>
                  <IconButton
                    data-test="datepicker-trigger"
                    size={inputSize ?? "md"}
                    aria-label="Open date picker"
                    onClick={() => {
                      setOpen(o => !o);
                    }}
                  >
                    {open ? <LuCalendarOff /> : <LuCalendar />}
                  </IconButton>
                </DatePicker.Trigger>
              ) : null}
              {showClearButton && clearButtonVisible ? (
                <IconButton
                  data-test="datepicker-clear"
                  size={inputSize ?? "md"}
                  aria-label="Clear date picker"
                  onClick={() => {
                    setDate(undefined);
                    setValue(undefined);
                  }}
                >
                  <FaTimes />
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
                            <MdOutlineChevronLeft />
                          </IconButton>
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger asChild>
                          <Button variant="ghost" size="sm" data-test="datepicker-month-label">
                            <DatePicker.RangeText />
                          </Button>
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <MdOutlineChevronRight />
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
                                      width="2em"
                                      height="2em"
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
                            <MdOutlineChevronLeft />
                          </IconButton>
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <DatePicker.RangeText />
                          </Button>
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <MdOutlineChevronRight />
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
                            <MdOutlineChevronLeft />
                          </IconButton>
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <DatePicker.RangeText />
                          </Button>
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <MdOutlineChevronRight />
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
