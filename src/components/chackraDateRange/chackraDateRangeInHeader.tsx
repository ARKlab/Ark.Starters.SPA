import { Button, Input, HStack } from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { TiTimes } from "react-icons/ti";

import { Field } from "../ui/field";
import "react-datepicker/dist/react-datepicker.css"; // Import required styles for react-datepicker
import { InputGroup } from "../ui/input-group";

export const ChackraDateRangeInHeader = (props: {
  dateFormat?: string;
  onChange: (e: string[]) => void;
  isLoading: boolean;
}) => {
  const { dateFormat, onChange, isLoading } = props;

  const [value, setValue] = useState<[Date | null, Date | null] | null>([null, null]);

  const handleOnChange = (dates: [Date | null, Date | null] | null) => {
    if (!dates?.[0] || !dates[1]) {
      setValue([null, null]);
      onChange([]);
    } else {
      const isoDates = dates.map(date => (date ? date.toISOString() : ""));
      setValue(dates);
      onChange(isoDates);
    }
  };

  return (
    <Field>
      <HStack zIndex="dropdown">
        <DatePicker
          selected={value?.[0]}
          startDate={value?.[0] ?? undefined}
          endDate={value?.[1] ?? undefined}
          onChange={dates => {
            handleOnChange(dates);
          }}
          selectsRange
          dateFormat={dateFormat ?? "dd-MM-yyyy"}
          disabled={isLoading}
          isClearable={false} // We handle clearing manually
          customInput={<Input placeholder="Select date range" />}
        />
        {value?.[0] && value[1] && (
          <InputGroup width="4.5rem" right="-11px">
            <Button
              rounded="full"
              size="xs"
              onClick={() => {
                handleOnChange([null, null]);
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
