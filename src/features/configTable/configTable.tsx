import React, { useEffect, useState } from "react";
import { Field, Form, FormRenderProps, useField } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
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
import { usePostConfigMutation } from "./configTableApi";

export type Employee = {
  name: string;
  surName: string;
  employed: boolean;
};

const nameValidator = z
  .string()
  .max(10)
  .refine((x) => !x.endsWith("Kail"), { message: "Kail is not allowed" });

const employedValidator = z.object({
  name: nameValidator,
  surName: z.string().nullable(),
  employed: z.boolean(),
});

//This is the "whole set" validator for the form. of course for us is a table but it is in fact a form
//In our configuration pattern this would be primarily used for primary key validation so i made it generic to accept a list of props
//to check for combinations of duplicates
const primaryKeyValidator =
  (propsToCheck: string[]) => (values: { table: Employee[] }) => {
    const errors: { table?: { _rowError?: string[] }[] } = {};
    if (!values.table) {
      return errors;
    }
    const propValues = values.table.map((e) =>
      propsToCheck.map((prop) => e[prop as keyof Employee]).join("|")
    );
    const duplicates = propValues.filter(
      (value, i) => value && propValues.indexOf(value) !== i
    );

    if (duplicates.length > 0) {
      errors.table = [];
      duplicates.forEach((duplicate) => {
        const duplicateIndexes = propValues.reduce(
          (dupIndexes: number[], value, i) => {
            if (value === duplicate) {
              dupIndexes.push(i);
            }
            return dupIndexes;
          },
          []
        );
        duplicateIndexes.forEach((index) => {
          if (!errors.table![index]) {
            errors.table![index] = { _rowError: [] };
          }
          errors.table![index]._rowError!.push(
            `Duplicate ${propsToCheck.join(
              ", "
            )} values are not allowed at indexes: ${duplicateIndexes.join(
              ", "
            )}`
          );
        });
      });
    }

    return errors;
  };

export default function EditableTableExample(props: {
  title: string;
  data: Employee[] | undefined;
  isLoading: boolean;
}) {
  const [postConfig, { isLoading: postConfigIsLoading }] =
    usePostConfigMutation();

  const onSubmit = async (values: { table: Employee[] }) => {
    await postConfig(values.table).unwrap();
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ table: props.data }}
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
      }: FormRenderProps<{ table: Employee[] }>) => {
        return (
          <VStack as="form" onSubmit={handleSubmit} spacing={6}>
            <Heading>{props.title}</Heading>
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
                isLoading={submitting || postConfigIsLoading}
              >
                Submit
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
                {props.isLoading ? (
                  <Spinner />
                ) : (
                  <FieldArray<Employee> name="table">
                    {({ fields, meta: { error } }) =>
                      fields.map((field, index) => {
                        return (
                          <>
                            <Tr key={index + "Row"}>
                              <Td>
                                <Field
                                  key={index + "RowError"}
                                  name={`${field}._rowError`}
                                  render={({
                                    input,
                                    meta: { error, modified },
                                  }) => {
                                    return (
                                      <Box>
                                        <Input hidden={true} {...input} />
                                      </Box>
                                    );
                                  }}
                                />
                                <Field
                                  validate={zod2FieldValidator(nameValidator)}
                                  name={`${field}.name`}
                                  render={({
                                    input,
                                    meta: { error, touched, modified },
                                  }) => {
                                    return (
                                      <Box>
                                        <FormControl
                                          isInvalid={error && touched}
                                          isDisabled={submitting}
                                        >
                                          <Input
                                            {...input}
                                            placeholder="First Name"
                                          />
                                          <FormErrorMessage>
                                            {error}
                                          </FormErrorMessage>
                                        </FormControl>
                                      </Box>
                                    );
                                  }}
                                />
                              </Td>
                              <Td>
                                <Field
                                  name={`${field}.surName`}
                                  render={({
                                    input,
                                    meta: { error, touched },
                                  }) => (
                                    <Box>
                                      <FormControl
                                        isInvalid={error && touched}
                                        isDisabled={submitting}
                                      >
                                        <Input {...input} />
                                        <FormErrorMessage>
                                          {error}
                                        </FormErrorMessage>
                                      </FormControl>
                                    </Box>
                                  )}
                                />
                              </Td>
                              <Td>
                                <Field
                                  name={`${field}.employed`}
                                  render={({
                                    input,
                                    meta: { error, touched },
                                  }) => (
                                    <FormControl
                                      isInvalid={error && touched}
                                      isDisabled={submitting}
                                    >
                                      <Checkbox {...input}>Employed</Checkbox>
                                      <FormErrorMessage>
                                        {error}
                                      </FormErrorMessage>
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
                          </>
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
