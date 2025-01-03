import {
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { useAppDispatch } from "../../app/hooks";
import { dispatchNetworkError } from "../../lib/errorHandler/errorHandler";

import { useGetConfigQuery, usePostConfigMutation } from "./configTableApi";
import { TableRow } from "./TableRow";

export type Employee = {
  name: string
  surName: string
  employed: boolean
}

const schema = z.object({
  table: z
    .array(
      z.object({
        name: z.string().max(10).refine((x) => !x.endsWith("Kail"), {
          message: "Kail is not allowed",
        }),
        surName: z.string().min(1),
        employed: z.boolean(),
      })
    )
    .refine((table) => {
      const names = table.map(t => t.name);
      const uniqueName = new Set(names);
      return uniqueName.size === names.length;
    }, { message: 'Duplicate names ar not allowed' }),
});


export default function EditableTableExample() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const toast = useToast();

  const [
    postConfig,
    { isLoading: postConfigIsLoading, isSuccess: postConfigSuccess },
  ] = usePostConfigMutation();

  const { data, isLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const onSubmit = async (values: { table: Employee[] }) => {
    console.log("OnSubmit: ", values);
    await postConfig({ employees: values.table, throwError: false })
      .unwrap()
      .catch((e) => {
        dispatch(dispatchNetworkError(e));
      });
  };

  async function throwError() {
    await postConfig({ employees: getValues().table, throwError: true })
      .unwrap()
      .catch((e) => {
        dispatch(dispatchNetworkError(e));
      });
  }

  useEffect(() => {
    if (postConfigSuccess) {
      toast({
        title: 'Config Submitted!',
        description: 'Configuration has been submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  }, [postConfigSuccess, toast])

  //#region FormConfiguration
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
    getValues
  } = useForm({
    defaultValues: { table: data ?? [] },
    values: { table: data ?? [] },
    mode: "onBlur",
    resolver: zodResolver(schema)
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
          isDisabled={isSubmitting || postConfigIsLoading || !isValid}
          isLoading={isSubmitting}
        >
          {t("submit")}
        </Button>
        <Button
          type="submit"
          isDisabled={isSubmitting || !isDirty || !errors}
          isLoading={isSubmitting || postConfigIsLoading}
          onClick={async () => {
            await throwError()
          }}
        >
          {t("triggerError")}
        </Button>
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
                  onDelete={() => { remove(i); }}
                />
              ))
          }
        </Tbody>
      </Table>

    </VStack >
  )
}

