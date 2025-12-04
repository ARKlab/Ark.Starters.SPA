import { Box, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AppDateRange } from "../../lib/components/AppDateRange/appDateRange";
import { AppInputFilter } from "../../lib/components/AppInputFilter/appInputFilter";
import type { AppSelectOptionItem } from "../../lib/components/AppSelect/appSelect";
import AppSelect from "../../lib/components/AppSelect/appSelect";

import ConsoleCard from "./consoleCard";
enum TestEnum {
  OptionOne = "OptionOne",
  OptionTwo = "OptionTwo",
  OptionThree = "OptionThree",
}
export default function ControlComponentsView() {
  const { t } = useTranslation();
  
  const [textFilterValue, setTextFilterValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string | undefined>(undefined);
  const [logs, setLogs] = useState<{ name: string; value: unknown }[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const handleInputChange = (name: string, value: unknown): void => {
    setLogs(prevLogs => [...prevLogs, { name, value }]);
  };

  function setDateRangeValue(value: Date[]) {
    setDateRange(value);
    handleInputChange("dateRange start", t('{{val, isoDate}}', { val: value[0] }));
    handleInputChange("dateRange end", t('{{val, isoDate}}', { val: value[1] }));
  }

  function onChangeSelect(value: string | undefined) {
    handleInputChange("selectFromEnum", value);
    setSelectValue(value);
  }

  function getOptionsFromEnumValues(
    enumObject: Record<string, string>,
    parser?: (value: string) => string,
    excludeValues?: string[],
  ): AppSelectOptionItem[] {
    return Object.values(enumObject)
      .filter(value => !excludeValues?.includes(value)) // Step 2: Filter out excluded values
      .map(
        value =>
          ({ label: value, value: parser ? parser(value) : value !== "NotSet" ? value : "" }) as AppSelectOptionItem,
      );
  }

  return (
    <Box>
      <Heading>Custom Controls</Heading>
      <Box mt={"2"}>
        <AppSelect
          onChange={onChangeSelect}
          options={getOptionsFromEnumValues(TestEnum)}
          title={"Select From Enum"}
          value={selectValue}
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
