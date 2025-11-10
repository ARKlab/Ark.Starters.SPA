import { Box, Heading } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";

import { AppDateRange } from "../../lib/components/AppDateRange/appDateRange";
import { AppInputFilter } from "../../lib/components/AppInputFilter/appInputFilter";
import type { Item } from "../../lib/components/AppSelect/appSelect";
import AppSelect from "../../lib/components/AppSelect/appSelect";

import ConsoleCard from "./consoleCard";
enum TestEnum {
  OptionOne = "OptionOne",
  OptionTwo = "OptionTwo",
  OptionThree = "OptionThree",
}
export default function ControlComponentsView() {
  const [textFilterValue, setTextFilterValue] = useState<string>("");
  const [logs, setLogs] = useState<{ name: string; value: unknown }[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const handleInputChange = (name: string, value: unknown): void => {
    setLogs(prevLogs => [...prevLogs, { name, value }]);
  };

  function setDateRangeValue(value: Date[]) {
    setDateRange(value);
    handleInputChange("dateRange start", format(value[0], "yyyy-MM-dd"));
    handleInputChange("dateRange end", format(value[1], "yyyy-MM-dd"));
  }

  function getOptionsFromEnumValues(
    enumObject: Record<string, string>,
    parser?: (value: string) => string,
    excludeValues?: string[],
  ): Item[] {
    return Object.values(enumObject)
      .filter(value => !excludeValues?.includes(value)) // Step 2: Filter out excluded values
      .map(value => ({ label: value, value: parser ? parser(value) : value !== "NotSet" ? value : "" }) as Item);
  }

  return (
    <Box>
      <Heading>Custom Controls</Heading>
      <Box mt={"2"}>
        <AppSelect
          handleInputChange={(name: string, value: unknown) => {
            handleInputChange(name, value);
          }}
          options={getOptionsFromEnumValues(TestEnum)}
          title={"Select From Enum"}
          propName={"selectFromEnum"}
        />

        <AppDateRange range={dateRange} setRange={setDateRangeValue} label={"Date range"} />
        <AppInputFilter
          value={textFilterValue}
          handleInputChange={(name: string, value: unknown) => {
            handleInputChange(name, value);
            setTextFilterValue(value as string);
          }}
          title={"Chackra Input Filter With Clear"}
          propName={"textFilter"}
        />
      </Box>
      <ConsoleCard logs={logs} setLogs={setLogs} />
    </Box>
  );
}
