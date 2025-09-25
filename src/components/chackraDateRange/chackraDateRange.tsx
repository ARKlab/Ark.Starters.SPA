import type { DateValue } from "@ark-ui/react/date-picker";
import { DatePicker } from "@ark-ui/react/date-picker";
import { Box, Button, Field, FieldLabel, HStack, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { TiTimes } from "react-icons/ti";
import "./chackraDateRange.css";

interface ChackraDateRangeProps extends DatePicker.RootProps {
  range: Date[];
  setRange: (range: Date[]) => void;
}

export const ChackraDateRange = (props: ChackraDateRangeProps) => {
  const { range, setRange, ...restProps } = props;
  const [value, setValue] = useState<DateValue[]>([]);

  function onValueChange(details: DatePicker.ValueChangeDetails) {
    if (details.value.length > 0) {
      setValue(details.value);
      const newRange = details.valueAsString.map(dateValue => new Date(dateValue));
      setRange(newRange);
    }
  }

  return (
    <Stack>
      <Field.Root>
        <FieldLabel>
          <Text as="b">DateRange test</Text>
        </FieldLabel>
        <DatePicker.Root
          positioning={{ sameWidth: true }}
          startOfWeek={1}
          numOfMonths={2}
          selectionMode="range"
          onValueChange={onValueChange}
          value={value}
          {...restProps}
        >
          <DatePicker.Control>
            <HStack gap={2}>
              <DatePicker.Input index={0} asChild>
                <Input w="30%" />
              </DatePicker.Input>
              <DatePicker.Input index={1} asChild>
                <Input w="30%" />
              </DatePicker.Input>
              <DatePicker.Trigger asChild>
                <IconButton w="5%" variant="ghost" aria-label="Open date picker">
                  <CiCalendar />
                </IconButton>
              </DatePicker.Trigger>
              <DatePicker.ClearTrigger asChild>
                <IconButton w="5%" variant="ghost" aria-label="Clear date picker">
                  <TiTimes />
                </IconButton>
              </DatePicker.ClearTrigger>
            </HStack>
          </DatePicker.Control>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
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
        </DatePicker.Root>
      </Field.Root>
    </Stack>
  );
};
