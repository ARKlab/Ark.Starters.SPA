import React, { useState } from "react";
import { Field, Form, FormRenderProps } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
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

    const nameSurnamePair = `${employee.name} ${employee.surName}`;
    if (nameSurnamePairs[nameSurnamePair] && nameSurnamePair != " ") {
      employeeErrors.name = "Name and surname pair must be unique";
      employeeErrors.surName = "Name and surname pair must be unique";
    } else {
      nameSurnamePairs[nameSurnamePair] = true;
    }

    return employeeErrors;
  });

  return errors;
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
                      .map((employee, index) => (
                        <Tr key={employee}>
                          <Td>
                            <Field
                              name={`${employee}.name`}
                              render={({ input, meta }) => (
                                <Box>
                                  <FormControl>
                                    <Input
                                      {...input}
                                      placeholder="First Name"
                                      isInvalid={
                                        errors &&
                                        errors.configData &&
                                        errors.configData[index] &&
                                        errors.configData[index].name
                                      }
                                    />
                                    {errors &&
                                      errors?.configData &&
                                      errors.configData[index] &&
                                      errors.configData[index].name && (
                                        <FormHelperText>
                                          {errors.configData[index].name}
                                        </FormHelperText>
                                      )}
                                  </FormControl>
                                </Box>
                              )}
                            />
                          </Td>
                          <Td>
                            <Field
                              name={`${employee}.surName`}
                              render={({ input, meta }) => (
                                <Box>
                                  <FormControl>
                                    <Input
                                      {...input}
                                      placeholder="Last Name"
                                      isInvalid={
                                        errors &&
                                        errors.configData &&
                                        errors.configData[index] &&
                                        errors.configData[index].surName
                                      }
                                    />
                                    {errors &&
                                      errors.configData &&
                                      errors.configData[index] &&
                                      errors.configData[index].surName && (
                                        <FormHelperText>
                                          {errors.configData[index].surName}
                                        </FormHelperText>
                                      )}
                                  </FormControl>
                                </Box>
                              )}
                            />
                          </Td>
                          <Td>
                            <Field
                              name={`${employee}.employed`}
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
