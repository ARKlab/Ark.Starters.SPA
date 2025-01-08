
import { Checkbox, FormControl, FormErrorMessage, IconButton, Input, Td, Tr } from "@chakra-ui/react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

import type { Employee } from "./configTable";

type TableRowProps = {
  control: Control<{ table: Employee[] }>
  errors?: FieldErrors<{ table: Employee[] }>;
  index: number;
  onDelete: () => void;
};

export function TableRow(props: TableRowProps) {
  const { control, index, errors, onDelete } = props;


  return (
    <Tr>
      <Td>
        <Controller
          name={`table.${index}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid}>
              <Input {...field} placeholder="Name" />
              <FormErrorMessage>
                {errors?.table?.[index]?.name?.message}
              </FormErrorMessage>
            </FormControl>
          )}
        />
      </Td>
      <Td>
        <Controller
          name={`table.${index}.surName`}
          control={control}
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid}>
              <Input {...field} placeholder="Surname" />
              <FormErrorMessage>
                {errors?.table?.[index]?.surName?.message}
              </FormErrorMessage>
            </FormControl>
          )}
        />
      </Td>

      <Td>
        <Controller
          name={`table.${index}.employed`}
          control={control}

          render={({ field }) => (
            <Checkbox
              {...field}
              value={""}
              isChecked={field.value}
            />
          )}
        />
      </Td>
      <Td>
        <IconButton
          icon={<FaTrash />}
          aria-label="Delete row"
          onClick={onDelete}
        />
      </Td>
    </Tr>
  )
}
