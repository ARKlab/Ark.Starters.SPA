import React, { useState } from "react";
import { Field, Form, FormRenderProps } from "react-final-form";
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
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ValidationErrors } from "final-form";

type ValidationErrorType = {
  configData: Employee[];
};

export type Employee = {
  name: string;
  surName: string;
  employed: boolean;
};

const onSubmit = async (values: { configData: Employee[] }) => {
  window.alert(JSON.stringify(values));
};

const validateForm = (values: { configData: Employee[] }) => {
  const errors: ValidationErrorType = { configData: [] };
  const nameSurnamePairs: { [key: string]: boolean } = {};

  errors.configData = values.configData.map((employee) => {
    const employeeErrors: any = {};
    if (!employee.name) {
      employeeErrors.name = "Required";
    }
    if (!employee.surName) {
      employeeErrors.surName = "Required";
    }

    const nameSurnamePair =
      employee.name && employee.surName
        ? `${employee.name} ${employee.surName}`
        : "";
    if (nameSurnamePair != "" && nameSurnamePairs[nameSurnamePair]) {
      employeeErrors.name = "Name and surname pair must be unique";
      employeeErrors.surName = "Name and surname pair must be unique";
    } else {
      nameSurnamePairs[nameSurnamePair] = true;
    }

    return employeeErrors;
  });

  return errors;
};

const isInvalidField = (
  errors: ValidationErrors,
  index: number,
  prop: string
) => {
  const err = R.pathOr(null, ["configData", index, prop], errors);
  if (err) return true;
  return false;
};

export default function EditableTableExample(props: {
  title: string;
  data: Employee[];
}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ configData: props.data }}
      mutators={{
        ...arrayMutators,
      }}
      validate={validateForm}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        },
        form,
        hasValidationErrors,
      }: FormRenderProps<{ configData: Employee[] }>) => {
        const { pristine, submitting, errors } = form.getState();
        return (
          <VStack as="form" onSubmit={handleSubmit} spacing={6}>
            <Heading>{props.title}</Heading>
            <HStack spacing={4}>
              <Button
                rightIcon={<FaPlus />}
                onClick={() =>
                  push("configData", {
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
                <FieldArray name="configData">
                  {({ fields }) =>
                    fields
                      .map((field, index) => (
                        <Tr key={index + "Row"}>
                          <Td>
                            <Field
                              name={`${field}.name`}
                              render={({ input, meta }) => (
                                <Box>
                                  <FormControl>
                                    <Input
                                      {...input}
                                      placeholder="First Name"
                                      isInvalid={isInvalidField(
                                        errors,
                                        index,
                                        "name"
                                      )}
                                    />
                                    {isInvalidField(errors, index, "name") && (
                                      <FormHelperText>
                                        {errors!.configData[index].name}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Box>
                              )}
                            />
                          </Td>
                          <Td>
                            <Field
                              name={`${field}.surName`}
                              render={({ input, meta }) => (
                                <Box>
                                  <FormControl>
                                    <Input
                                      {...input}
                                      isInvalid={isInvalidField(
                                        errors,
                                        index,
                                        "surName"
                                      )}
                                    />
                                    {isInvalidField(
                                      errors,
                                      index,
                                      "surName"
                                    ) && (
                                      <FormHelperText>
                                        {errors!.configData[index].surName}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Box>
                              )}
                            />
                          </Td>
                          <Td>
                            <Field
                              name={`${field}.employed`}
                              render={({ input }) => (
                                <Checkbox {...input}>Employed</Checkbox>
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
                      ))
                      .reverse()
                  }
                </FieldArray>
              </Tbody>
            </Table>
          </VStack>
        );
      }}
    />
  );
}
