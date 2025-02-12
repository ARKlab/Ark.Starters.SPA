import { Checkbox, Field, IconButton, Input, Td, Tr } from "@chakra-ui/react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

import type { Employee } from "./configTable";

type TableRowProps = {
  control: Control<{ table: Employee[] }>;
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
            <Field.Root invalid={fieldState.invalid}>
              <Input {...field} placeholder="Name" />
              <Field.ErrorText>{errors?.table?.[index]?.name?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />
      </Td>
      <Td>
        <Controller
          name={`table.${index}.surName`}
          control={control}
          render={({ field, fieldState }) => (
            <Field.Root invalid={fieldState.invalid}>
              <Input {...field} placeholder="Surname" />
              <Field.ErrorText>{errors?.table?.[index]?.surName?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />
      </Td>

      <Td>
        <Controller
          name={`table.${index}.employed`}
          control={control}
          render={({ field }) => <Checkbox {...field} value={""} isChecked={field.value} />}
        />
      </Td>
      <Td>
        <IconButton icon={<FaTrash />} aria-label="Delete row" onClick={onDelete} />
      </Td>
    </Tr>
  );
}
