import {
  Center,
  HStack,
  Heading,
  IconButton,
  Spinner,
  Table,
  VStack,
} from "@chakra-ui/react";
import arrayMutators from "final-form-arrays";
import { useEffect } from "react";
import { Form, useFormState } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import * as z from "zod";

import { useAppDispatch } from "../../app/hooks";
import { CheckboxControl, InputControl } from "../../components/reactFinalFormControls";
import { Button } from "../../components/ui/button";
import { Toaster } from "../../components/ui/toaster";
import { toaster } from "../../components/ui/toaster-helper";
import { dispatchNetworkError } from "../../lib/errorHandler/errorHandler";
import { useRenderCount } from "../../lib/useRenderCount";
import { zod2FieldValidator } from "../../lib/zod2FormValidator";

import { useGetConfigQuery, usePostConfigMutation } from "./configTableApi";

export type Employee = {
  name: string
  surName: string
  employed: boolean
}

const nameValidator = z
  .string()
  .max(10)
  .refine((x) => !x.endsWith('Kail'), { message: 'Kail is not allowed' })

//This is the "whole set" validator for the form. of course for us is a table but it is in fact a form
//In our configuration pattern this would be primarily used for primary key validation so i made it generic to accept a list of props
//to check for combinations of duplicates
const primaryKeyValidator =
  (propsToCheck: string[]) => (values: { table?: Employee[] }) => {
    const errors: { table?: { _rowError?: string[] }[] } = {}

    const table = values.table

    if (!table) {
      return errors
    }

    const propValues = table.map((e) =>
      propsToCheck.map((prop) => e[prop as keyof Employee]).join('|'),
    )
    const duplicates: string[] = []

    propValues.forEach((value) => {
      const duplicateIndexes = propValues.reduce<number[]>(
        (indexes, propValue, index) => {
          if (propValue === value) {
            indexes.push(index)
          }
          return indexes
        },
        [],
      )

      if (duplicateIndexes.length > 1 && !duplicates.includes(value)) {
        duplicates.push(value)

        duplicateIndexes.forEach((index) => {
          errors.table = errors.table ?? []
          errors.table[index] = errors.table[index] || { _rowError: [] }
          const e = errors.table[index]._rowError ?? []

          e.push(
            `Duplicate ${propsToCheck.join(
              ', ',
            )} values are not allowed at indexes: ${duplicateIndexes.join(
              ', ',
            )}`,
          )
          errors.table[index]._rowError = e;
        })
      }
    })

    return errors
  }


export default function EditableTableExample() {
  const [
    postConfig,
    { isLoading: postConfigIsLoading, isSuccess: postConfigSuccess },
  ] = usePostConfigMutation();

  const { data, isLoading: getConfigIsLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const toast = Toaster();

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (postConfigSuccess) {
      toaster.create({
        title: 'Config Submitted!',
        description: 'Configuration has been submitted successfully',
        type: 'success',
        duration: 5000,
        placement: 'bottom-end',
      });
    }
  }, [postConfigSuccess, toast])

  type FormValue = {
    table: Employee[];
    throwError: boolean;
  };

  const onSubmit = async (values: FormValue) => {
    await postConfig({ employees: values.table, throwError: values.throwError })
      .unwrap()
      .catch((e) => {
        dispatch(dispatchNetworkError(e));
      });
  };
  const { t } = useTranslation();



  return (
    <Form<FormValue>
      onSubmit={onSubmit}
      initialValues={{ table: data }}
      mutators={{
        ...arrayMutators,
      }}
      validate={primaryKeyValidator(['name', 'surName'])}
      render={({
        handleSubmit,
        form: {
          mutators: { push },
        },
        form,
        submitting,
        pristine,
        hasValidationErrors,
      }) => {
        return (
          <VStack as="form" onSubmit={handleSubmit} gap={6}>
            <Heading>{t("employee")}</Heading>
            <HStack gap={4}>
              <Button
                onClick={() =>
                  void push("table", {
                    name: "",
                    surName: "",
                    employed: false,
                  })
                }
                colorScheme="green"
                aria-label="Add Employee"
              >
                {t("new")}
              </Button>
              <Button
                type="submit"
                disabled={submitting || pristine || hasValidationErrors}
                loading={submitting}
                onClick={() => {
                  form.change("throwError", false);
                }}
              >
                {t("submit")}
              </Button>
              <Button
                type="submit"
                disabled={submitting || pristine || hasValidationErrors}
                loading={submitting || postConfigIsLoading}
                onClick={() => {
                  form.change("throwError", true);
                }}
              >
                {t("triggerError")}
              </Button>
              <Button
                onClick={() => {
                  form.reset();
                }}
                disabled={submitting || pristine}
              >
                {t("reset")}
              </Button>
            </HStack>
            <Table.Root variant="line">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>{t("firstname")}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t("lastname")}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t("employed")}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t("actions")}</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getConfigIsLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Center>
                        <Spinner data-role="spinner" />
                      </Center>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <FieldArray<Employee>
                    name="table"
                    render={({ fields }) =>
                      fields.map((name, index) => {
                        return <TableRow key={name} name={name} index={index} onDelete={() => fields.remove(index)} />;
                      })
                    }
                  ></FieldArray>
                )}
              </Table.Body>
            </Table.Root>
          </VStack>
        );
      }}
    />
  )
}

const TableRow = (props: {
  name: string
  index: number
  onDelete: () => void
}) => {
  const { name, onDelete } = props
  const { t } = useTranslation();

  const renderCount = useRenderCount();

  const { submitting } = useFormState({ subscription: { submitting: true } });

  return (
    <Table.Row>
      <Table.Cell>
        <InputControl
          validate={zod2FieldValidator(nameValidator)}
          name={`${name}.name`}
        />
      </Table.Cell>
      <Table.Cell>
        <InputControl
          name={`${name}.surName`}
        />
      </Table.Cell>
      <Table.Cell>
        <CheckboxControl name={`${name}.employed`} label={t("employed")} />
      </Table.Cell>
      <Table.Cell>
        {/*<IconButton
          disabled={submitting}
          onClick={onDelete}
          colorScheme="red"
          aria-label="Remove Employee"
        >
          <FaTrash />
        </IconButton>*/}
        {renderCount}
      </Table.Cell>
    </Table.Row>
  )
}
