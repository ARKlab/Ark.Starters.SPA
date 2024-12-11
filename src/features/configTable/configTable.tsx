import {
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { useGetConfigQuery } from "./configTableApi";
import { TableRow } from "./TableRow";

// import { useGetConfigQuery } from "./configTableApi";

// import { useAppDispatch } from "../../app/hooks";

export type Employee = {
  name: string
  surName: string
  employed: boolean
}

const schema = z.object({
  table: z.array(
    z.object({
      name: z.string().max(10).refine((x) => !x.endsWith("Kail"), {
        message: "Kail is not allowed",
      }),
      surName: z.string().min(1),
      employed: z.boolean(),
    })
  ),
});


export default function EditableTableExample() {
  const { t } = useTranslation();

  const { data, isLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const onSubmit = async (_: { table: Employee[] }) => {
    await undefined;
  };

  //#region FormConfiguration
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty }
  } = useForm({
    defaultValues: { table: data || [] },
    values: { table: data || [] },
    mode: "onBlur",
    resolver: zodResolver(schema)
  });

  const { fields, append } = useFieldArray({
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
              name: '',
              surName: '',
              employed: false,
            });
          }
          }
          colorScheme="green"
          aria-label="Add Employee"
        >
          {t("new")}
        </Button>
        <Button
          type="submit"
          isDisabled={isSubmitting || !isValid}
          isLoading={isSubmitting}
        >
          {t("submit")}
        </Button>
        {/* <Button
          type="submit"
          isDisabled={submitting || pristine || hasValidationErrors}
          isLoading={submitting || postConfigIsLoading}
          onClick={() => {
            form.change('throwError', true)
          }}
        >
          {t("triggerError")}
        </Button> */}
        <Button
          isDisabled={!isDirty}
          onClick={() => { reset(); }}
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
          {
            isLoading
              ?
              "isLoading"
              :
              fields.map((f, i) => (
                <TableRow
                  key={i + f.id + 'row'}
                  control={control}
                  index={i}
                  errors={errors}
                />
              ))
          }
        </Tbody>
      </Table>

    </VStack>
  )
}

