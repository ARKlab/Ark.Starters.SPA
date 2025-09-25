import { Box, Heading } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";

import { ChackraDateRange } from "../../components/chackraDateRange/chackraDateRange";
import { ChackraInputFilterWithClear } from "../../components/chackraInputFilterWithClear/chackraInputFilterWithClear";
import type { Item } from "../../components/chackraSelectWithClear/chackraSelectWithClear";
import ChackraSelectWithClear from "../../components/chackraSelectWithClear/chackraSelectWithClear";
import ChackraTagInput from "../../components/chackraTagInput";

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
      <Box marginTop={"20px"}>
        <ChackraTagInput
          handleInputChange={(name: string, value: unknown) => {
            handleInputChange(name, value);
          }}
          title={"Tag Input"}
          propName={"tgagInput"}
        />
        <ChackraSelectWithClear
          handleInputChange={(name: string, value: unknown) => {
            handleInputChange(name, value);
          }}
          options={getOptionsFromEnumValues(TestEnum)}
          title={"Select From Enum"}
          propName={"selectFromEnum"}
        />

        <ChackraDateRange range={dateRange} setRange={setDateRangeValue} />
        <ChackraInputFilterWithClear
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
