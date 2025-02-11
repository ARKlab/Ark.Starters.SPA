import { Button, Input, HStack } from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { TiTimes } from "react-icons/ti";
import "react-datepicker/dist/react-datepicker.css"; // Import required styles for react-datepicker

import { formatDateToString } from "../../lib/helper"; // Moved to the correct position
import { Field } from "../ui/field";
import { InputGroup } from "../ui/input-group";

export const ChackraDateRange = (props: {
  handleInputChange: (name: string, value: unknown) => void;
  propForm: string;
  propTo: string;
  label: string;
  dateFormat?: string;
}) => {
  const { handleInputChange, propForm, propTo, label, dateFormat } = props;

  const [fromToRange, setFromToRange] = useState<[Date | null, Date | null] | null>([null, null]);

  const handleFromToDataRangeChange = (dates: [Date | null, Date | null] | null, d1: string, d2: string) => {
    if (!dates || dates.some(date => date === null)) {
      handleInputChange(d1, "");
      handleInputChange(d2, "");
      setFromToRange([null, null]);
    } else {
      handleInputChange(d1, formatDateToString(dates[0]));
      handleInputChange(d2, formatDateToString(dates[1]));
      setFromToRange(dates);
    }
  };

  return (
    <Field mr="2%" label={label}>
      <HStack zIndex="dropdown">
        <DatePicker
          selected={fromToRange?.[0] ?? undefined} // Changed to nullish coalescing
          startDate={fromToRange?.[0] ?? undefined} // Changed to nullish coalescing
          endDate={fromToRange?.[1] ?? undefined} // Changed to nullish coalescing
          onChange={dates => {
            handleFromToDataRangeChange(dates, propForm, propTo);
          }}
          selectsRange
          dateFormat={dateFormat ?? "dd-MM-yyyy"} // Changed to nullish coalescing
          isClearable={false}
          customInput={<Input placeholder="Select date range" />}
        />
        {fromToRange?.[0] && fromToRange[1] && (
          <InputGroup width="4.5rem" right="-11px">
            <Button
              rounded="full"
              h="1rem"
              size="xs"
              onClick={() => {
                handleFromToDataRangeChange(null, propForm, propTo);
              }}
            >
              <TiTimes />
            </Button>
          </InputGroup>
        )}
      </HStack>
    </Field>
  );
};
