import React, { useState, ReactNode } from "react";
import { Form, Field } from "react-final-form";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Stack,
} from "@chakra-ui/react";
import { z } from "zod";
import { zod2FieldValidator } from "../../lib/zod2form";
import { Wizard, WizardPage } from "../../components/wizard/wizard";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values: string | number) => {
  await sleep(300);
  window.alert(JSON.stringify(values, null, 2));
};
const emailSchema = z.string().email();
const required = z.string().min(1);
const passwordComplexity = z.string().refine((v) => v.length > 6, {
  message: "Password needs to be at least 6 characters",
});

const WizardFormView = () => (
  <Box my="70px">
    <Heading>Wizard Form🧙‍♂️ </Heading>
    <Box marginTop={"20px"}>
      <Wizard onSubmit={onSubmit}>
        <WizardPage>
          <Stack spacing={4}>
            <Field name="firstName" validate={zod2FieldValidator(required)}>
              {({ input, meta: { error, touched } }) => (
                <FormControl isInvalid={error && touched}>
                  <Input {...input} type="text" placeholder="First Name" />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="lastName" validate={zod2FieldValidator(required)}>
              {({ input, meta: { error, touched } }) => (
                <FormControl isInvalid={error && touched}>
                  <Input {...input} type="text" placeholder="Last Name" />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="email" validate={zod2FieldValidator(emailSchema)}>
              {({ input, meta: { error, touched } }) => (
                <FormControl isInvalid={error && touched}>
                  <Input {...input} type="email" placeholder="Email" />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field
              name="password"
              validate={zod2FieldValidator(passwordComplexity)}
            >
              {({ input, meta: { error, touched } }) => (
                <FormControl isInvalid={error && touched}>
                  <Input {...input} type="password" placeholder="Password" />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Stack>
        </WizardPage>
        <WizardPage>
          <Field name="phone">
            {({ input, meta }) => (
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input {...input} type="text" placeholder="Phone" />
              </FormControl>
            )}
          </Field>
          <Field name="billingAddress">
            {({ input, meta }) => (
              <FormControl>
                <FormLabel>Billing Address</FormLabel>
                <Input {...input} type="text" placeholder="Billing Address" />
              </FormControl>
            )}
          </Field>
          <Field name="shippingAddress">
            {({ input, meta }) => (
              <FormControl>
                <FormLabel>Shipping Address (Optional)</FormLabel>
                <Input {...input} type="text" placeholder="Shipping Address" />
              </FormControl>
            )}
          </Field>
        </WizardPage>
        <WizardPage>
          <Field name="newsletter" type="checkbox">
            {({ input, meta }) => (
              <Checkbox {...input}>Subscribe to Newsletter</Checkbox>
            )}
          </Field>
          <Field name="specialOffers" type="checkbox">
            {({ input, meta }) => (
              <Checkbox {...input}>Receive Special Offers via Email</Checkbox>
            )}
          </Field>
          <Field name="smsNotifications" type="checkbox">
            {({ input, meta }) => (
              <Checkbox {...input}>Receive SMS Notifications</Checkbox>
            )}
          </Field>
        </WizardPage>
        <WizardPage>
          <Text>Review and confirm your details</Text>
        </WizardPage>
      </Wizard>
    </Box>
  </Box>
);

export default WizardFormView;
