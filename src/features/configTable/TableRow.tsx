import { Field, IconButton, Input, Table } from "@chakra-ui/react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { LuTrash2 } from "react-icons/lu";

import { Checkbox } from "../../components/ui/checkbox";

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
    <Table.Row verticalAlign={"top"}>
      <Table.Cell>
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
      </Table.Cell>
      <Table.Cell>
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
      </Table.Cell>

      <Table.Cell>
        <Controller
          name={`table.${index}.employed`}
          control={control}
          render={({ field }) => <Checkbox {...field} value={""} checked={field.value} />}
        />
      </Table.Cell>
      <Table.Cell>
        <IconButton aria-label="Delete row" onClick={onDelete} colorPalette={"error"} size="xs">
          <LuTrash2 />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
}
