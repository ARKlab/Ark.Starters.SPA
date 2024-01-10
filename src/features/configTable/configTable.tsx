import React, { useEffect, useState } from "react";
import { Field, Form, FormRenderProps, useField } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray, FieldArrayRenderProps } from "react-final-form-arrays";
import * as R from "ramda";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  FormLabel,
  Input,
  VStack,
  Heading,
  Spacer,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormErrorMessage,
  FormControl,
  FormHelperText,
  Spinner,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ValidationErrors } from "final-form";
import { z } from "zod";
import { zod2FieldValidator, zod2FormValidator } from "../../lib/zod2form";
import { useGetConfigQuery, usePostConfigMutation } from "./configTableApi";
import _ from "lodash";
import errorHandler, {
  dispatchNetworkError,
} from "../errorHandler/errorHandler";
import { dispatchNotification } from "../notifications/notification";
import { useAppDispatch } from "../../app/hooks";
import {
  NotificationDuration,
  NotificationPosition,
} from "../notifications/notificationsTypes";

export type Employee = {
  name: string;
  surName: string;
  employed: boolean;
};

const nameValidator = z
  .string()
  .max(10)
  .refine((x) => !x.endsWith("Kail"), { message: "Kail is not allowed" });

type RowError = {
  index: number;
  message: string;
};

//This is the "whole set" validator for the form. of course for us is a table but it is in fact a form
//In our configuration pattern this would be primarily used for primary key validation so i made it generic to accept a list of props
//to check for combinations of duplicates
const primaryKeyValidator =
  (propsToCheck: string[]) => (values: { table?: Employee[] }) => {
    const errors: { table?: { _rowError?: string[] }[] } = {};

    const table = values.table;

    if (!table) {
      return errors;
    }

    const propValues = table.map((e) =>
      propsToCheck.map((prop) => e[prop as keyof Employee]).join("|")
    );
    const duplicates: string[] = [];

    propValues.forEach((value, i) => {
      const duplicateIndexes = propValues.reduce(
        (indexes, propValue, index) => {
          if (propValue === value) {
            indexes.push(index);
          }
          return indexes;
        },
        [] as number[]
      );

      if (duplicateIndexes.length > 1 && !duplicates.includes(value)) {
        duplicates.push(value);

        duplicateIndexes.forEach((index) => {
          errors.table = errors.table || [];
          errors.table[index] = errors.table[index] || { _rowError: [] };

          errors.table[index]._rowError!.push(
            `Duplicate ${propsToCheck.join(
              ", "
            )} values are not allowed at indexes: ${duplicateIndexes.join(
              ", "
            )}`
          );
        });
      }
    });

    return errors;
  };

export default function EditableTableExample() {
  const [
    postConfig,
    {
      isLoading: postConfigIsLoading,
      isSuccess: postConfigSuccess,
      isError: postConfigIsError,
      error: postConfigError,
    },
  ] = usePostConfigMutation();

  const { data, isLoading: getConfigIsLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (postConfigSuccess) {
      dispatch(
        dispatchNotification({
          id: "1",
          title: "Config Submitted!",
          message: "Configuration has been submitted successfully",
          status: "success",
          duration: NotificationDuration.Medium,
          isClosable: true,
          position: "bottom-right",
        })
      );
    }
  }, [postConfigSuccess, dispatch]);

  const onSubmit = async (values: {
    table: Employee[];
    throwError: boolean;
  }) => {
    await postConfig({ employees: values.table, throwError: values.throwError })
      .unwrap()
      .catch((e) => {
        dispatch(dispatchNetworkError(e));
      });
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ table: data }}
      mutators={{
        ...arrayMutators,
      }}
      validate={primaryKeyValidator(["name", "surName"])}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        },
        form,
        submitting,
        pristine,
        hasValidationErrors,
      }: FormRenderProps<{ table: Employee[]; throwError: boolean }>) => {
        return (
          <VStack as="form" onSubmit={handleSubmit} spacing={6}>
            <Heading>Employee</Heading>
            <HStack spacing={4}>
              <Button
                rightIcon={<FaPlus />}
                onClick={() =>
                  push("table", {
                    name: "",
                    surName: "",
                    employed: false,
                  })
                }
                colorScheme="green"
                aria-label="Add Employee"
              >
                New Employee
              </Button>
              <Button
                type="submit"
                isDisabled={submitting || pristine || hasValidationErrors}
                isLoading={submitting}
                onClick={() => {
                  form.change("throwError", false);
                }}
              >
                Submit
              </Button>
              <Button
                type="submit"
                isDisabled={submitting || pristine || hasValidationErrors}
                isLoading={submitting || postConfigIsLoading}
                onClick={() => {
                  form.change("throwError", true);
                }}
              >
                Submit Error
              </Button>
              <Button
                onClick={() => form.reset()}
                isDisabled={submitting || pristine}
              >
                Reset
              </Button>
            </HStack>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Employed</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {getConfigIsLoading ? (
                  <Tr>
                    <Spinner />
                  </Tr>
                ) : (
                  <FieldArray<Employee> name="table">
                    {({ fields, meta: { error } }) =>
                      fields.map((field, index) => {
                        return (
                          <TableRow
                            key={index + field + "row"}
                            name={field}
                            index={index}
                            submitting={submitting}
                            fields={fields}
                          />
                        );
                      })
                    }
                  </FieldArray>
                )}
              </Tbody>
            </Table>
          </VStack>
        );
      }}
    />
  );
}

const TableRow = (props: {
  name: string;
  index: number;
  submitting: boolean;
  fields: any;
}) => {
  const { name, index, submitting, fields } = props;
  var {
    meta: { error },
  } = useField(name + "_rowError");
  var color = error ? "red.100" : "white";
  var rowError = error;
  return (
    <Tr key={index + name} bgColor={color}>
      <Td>
        <Field
          validate={zod2FieldValidator(nameValidator)}
          name={`${name}.name`}
          render={({ input, meta: { error, touched } }) => {
            error = error || rowError;
            return (
              <FormControl isInvalid={error && touched} isDisabled={submitting}>
                <Input {...input} placeholder="First Name" />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
            );
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
              <Checkbox {...input}>Employed</Checkbox>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          )}
        />
      </Td>
      <Td>
        <IconButton
          icon={<FaTrash />}
          onClick={() => fields.remove(index)}
          colorScheme="red"
          aria-label="Remove Employee"
        />
      </Td>
    </Tr>
  );
};
