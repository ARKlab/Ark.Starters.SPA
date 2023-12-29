import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";
import { format } from "date-fns";

export const ChackraDateRange = (props: {
  handleInputChange: (name: string, value: any) => void;
  propForm: string;
  propTo: string;
  label: string;
  dateFormat?: string;
}) => {
  const [fromToRange, setFromToRange] = useState<Date[]>([]);

  const handleFromToDataRangeChange = async (
    value: Date[],
    d1: string,
    d2: string
  ) => {
    if (value.length === 0) {
      props.handleInputChange(d1, "");
      props.handleInputChange(d2, "");
    }
    if (value[0]) {
      props.handleInputChange(d1, formatDateToString(value[0]));
    }
    if (value[1]) {
      props.handleInputChange(d2, formatDateToString(value[1]));
    }

    setFromToRange(value);
  };

  return (
    <FormControl mr="2%">
      <FormLabel>
        <Text color="brand.dark" as="b">
          {props.label}
        </Text>
      </FormLabel>

      <InputGroup zIndex={"dropdown"}>
        <RangeDatepicker
          configs={{
            dateFormat: props.dateFormat ? props.dateFormat : "dd-MM-yyyy",
          }}
          selectedDates={fromToRange}
          onDateChange={(e) =>
            handleFromToDataRangeChange(e, props.propForm, props.propTo)
          }
        />
        {fromToRange.length > 0 && (
          <InputRightElement width="4.5rem" right="-11px">
            <Button
              rounded={"full"}
              h="1rem"
              size="xs"
              onClick={(e) =>
                handleFromToDataRangeChange([], props.propForm, props.propTo)
              }
            >
              <TiTimes />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};
export const formatDateToString = (date: Date | null, dateFormat?: string) => {
  if (!dateFormat) {
    dateFormat = "yyyy-MM-dd";
  }
  return date ? format(date, dateFormat) : "";
};
