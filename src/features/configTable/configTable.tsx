import {
  Button,
  Center,
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  IconButton,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import arrayMutators from "final-form-arrays";
import { useEffect } from "react";
import { Field, Form, useField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import * as z from "zod";

import { useAppDispatch } from "../../app/hooks";
import { dispatchNetworkError } from "../../lib/errorHandler/errorHandler";
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
          errors.table = errors.table || []
          errors.table[index] = errors.table[index] || { _rowError: [] }
          const e = errors.table[index]._rowError || []

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

  const toast = useToast();

  const dispatch = useAppDispatch()

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
          <VStack as="form" onSubmit={handleSubmit} spacing={6}>
            <Heading>{t("employee")}</Heading>
            <HStack spacing={4}>
              <Button
                onClick={() =>
                  void push('table', {
                    name: '',
                    surName: '',
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
                isDisabled={submitting || pristine || hasValidationErrors}
                isLoading={submitting}
                onClick={() => {
                  form.change('throwError', false)
                }}
              >
                {t("submit")}
              </Button>
              <Button
                type="submit"
                isDisabled={submitting || pristine || hasValidationErrors}
                isLoading={submitting || postConfigIsLoading}
                onClick={() => {
                  form.change('throwError', true)
                }}
              >
                {t("triggerError")}
              </Button>
              <Button
                onClick={() => { form.reset(); }}
                isDisabled={submitting || pristine}
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
                {getConfigIsLoading ? (
                  <Tr>
                    <Td colSpan={3}>
                      <Center>
                        <Spinner data-role='spinner' />
                      </Center>
                    </Td>
                  </Tr>
                ) : (
                  <FieldArray<Employee> name="table">
                    {({ fields }) =>
                      fields.map((field, index) => {
                        return (
                          <TableRow
                            key={index + field + 'row'}
                            name={field}
                            index={index}
                            submitting={submitting}
                            onDelete={() => fields.remove(index)}
                          />
                        )
                      })
                    }
                  </FieldArray>
                )}
              </Tbody>
            </Table>
          </VStack>
        )
      }}
    />
  )
}

const TableRow = (props: {
  name: string
  index: number
  submitting: boolean
  onDelete: () => void
}) => {
  const { name, index, submitting, onDelete } = props
  const {
    meta: { error },
  } = useField(name + "_rowError");
  const rowError = error;
  const { t } = useTranslation();
  return (
    <Tr key={index + name}>
      <Td>
        <Field
          validate={zod2FieldValidator(nameValidator)}
          name={`${name}.name`}
          render={({ input, meta: { error, touched } }) => {
            error = error || rowError
            return (
              <FormControl isInvalid={error && touched} isDisabled={submitting}>
                <Input {...input} placeholder="First Name" />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
            )
          }}
        />
      </Td>
      <Td>
        <Field
          name={`${name}.surName`}
          render={({ input, meta: { error, touched } }) => (
            <FormControl isInvalid={error && touched} isDisabled={submitting}>
              <Input {...input} />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          )}
        />
      </Td>
      <Td>
        <Field
          type="checkbox"
          name={`${name}.employed`}
          render={({ input, meta: { error, touched } }) => (
            <FormControl isInvalid={error && touched} isDisabled={submitting}>
              <Checkbox isChecked={input.checked} onChange={input.onChange}>
                {t("employed")}
              </Checkbox>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          )}
        />
      </Td>
      <Td>
        <IconButton
          isDisabled={submitting}
          icon={<FaTrash />}
          onClick={onDelete}
          colorScheme="red"
          aria-label="Remove Employee"
        />
      </Td>
    </Tr>
  )
}
