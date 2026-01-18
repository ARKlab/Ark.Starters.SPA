import { Button, Heading, HStack, Spinner, Table, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { toaster } from "../../components/ui/toaster";

import { useGetConfigQuery, usePostConfigMutation } from "./configTableApi";
import { TableRow } from "./TableRow";

export type Employee = {
  name: string;
  surName: string;
  employed: boolean;
};

const configTableSchema = z.object({
  table: z
    .array(
      z.object({
        name: z
          .string()
          .min(3)
          .max(10)
          .refine(x => !x.endsWith("Kail"), {
            message: "Kail is not allowed",
          }),
        surName: z.string().min(1),
        employed: z.boolean(),
      }),
    )
    .superRefine((table, ctx) => {
      const names = table.reduce<Record<string, number>>((acc, x) => {
        acc[x.name] = (acc[x.name] || 0) + 1;
        return acc;
      }, {});

      table.forEach((t, idx) => {
        if (names[t.name] > 1) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate names are not allowed",
            path: [idx, "name"],
          });
        }
      });
    }),
});

export default function EditableTableExample() {
  const { t } = useTranslation();

  const [postConfig, { isLoading: postConfigIsLoading }] = usePostConfigMutation();

  const { data, isLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [throwError, setError] = useState<boolean>(false);

  const onSubmit = async (values: { table: Employee[] }) => {
    const r = await postConfig({ employees: values.table, throwError });
    setError(false);
    if (!r.error)
      toaster.create({
        title: "Config Submitted!",
        description: "Configuration has been submitted successfully",
        type: "success",
        duration: 5000,
      });
  };

  //#region FormConfiguration
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    defaultValues: { table: data ?? [] },
    values: { table: data ?? [] },
    mode: "onChange",
    resolver: zodResolver(configTableSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "table",
  });
  //#endregion

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} gap="6">
      <Heading>{t("employee")}</Heading>

      <HStack gap="4">
        <Button
          onClick={() => {
            append({
              name: "",
              surName: "",
              employed: false,
            });
          }}
          aria-label="Add Employee"
        >
          {t("new")}
        </Button>
        <Button type="submit" disabled={isSubmitting || postConfigIsLoading || !isValid} loading={isSubmitting}>
          {t("submit")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !errors}
          loading={isSubmitting || postConfigIsLoading}
          onClick={() => {
            setError(true);
          }}
        >
          {t("triggerError")}
        </Button>
        <Button
          disabled={!isDirty}
          onClick={() => {
            reset();
          }}
        >
          {t("reset")}
        </Button>
      </HStack>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("firstname")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("lastname")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("employed")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("actions")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <tr>
              <td colSpan={100} align="center" style={{ padding: "2rem" }}>
                <Spinner />
              </td>
            </tr>
          ) : (
            fields.map((f, i) => (
              <TableRow
                key={i + f.id + "row"}
                control={control}
                index={i}
                errors={errors}
                onDelete={() => {
                  remove(i);
                }}
              />
            ))
          )}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
