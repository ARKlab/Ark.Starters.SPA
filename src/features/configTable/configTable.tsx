import { Button, Heading, HStack, Spinner, Table, Tbody, Th, Thead, Tr, useToast, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { useAppDispatch } from "../../app/hooks";
import { dispatchNetworkError } from "../../lib/errorHandler/errorHandler";

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

type ConfigTableType = z.infer<typeof configTableSchema>;

export default function EditableTableExample() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const toast = useToast();

  const [postConfig, { isLoading: postConfigIsLoading, isSuccess: postConfigSuccess }] = usePostConfigMutation();

  const { data, isLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [throwError, setThrowError] = useState<boolean>(false);

  const onSubmit = async (values: { table: Employee[] }) => {
    console.log("OnSubmit: ", values);
    try {
      await postConfig({ employees: values.table, throwError })
        .unwrap()
        .catch(e => {
          dispatch(dispatchNetworkError(e));
        });
    } finally {
      setThrowError(false);
    }
  };

  useEffect(() => {
    if (postConfigSuccess) {
      toast({
        title: "Config Submitted!",
        description: "Configuration has been submitted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }, [postConfigSuccess, toast]);

  //#region FormConfiguration
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<ConfigTableType>({
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
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={6}>
      <Heading>{t("employee")}</Heading>

      <HStack spacing={4}>
        <Button
          onClick={() => {
            append({
              name: "",
              surName: "",
              employed: false,
            });
          }}
          colorPalette="green"
          aria-label="Add Employee"
        >
          {t("new")}
        </Button>
        <Button type="submit" disabled={isSubmitting || postConfigIsLoading || !isValid} isLoading={isSubmitting}>
          {t("submit")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !errors}
          isLoading={isSubmitting || postConfigIsLoading}
          onClick={() => {
            setThrowError(true);
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

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t("firstname")}</Th>
            <Th>{t("lastname")}</Th>
            <Th>{t("employed")}</Th>
            <Th>{t("actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
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
        </Tbody>
      </Table>
    </VStack>
  );
}
