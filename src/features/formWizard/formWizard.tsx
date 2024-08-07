import { Box, FormControl, FormErrorMessage, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "react-final-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { CharkaCheckBoxFinalFormField } from "../../components/reactFinalFormControls";
import { Wizard, WizardPage } from "../../components/wizard/wizard";
import { zod2FieldValidator } from "../../lib/zod2FormValidator";

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const emailSchema = z.string().email();
const required = z.string().min(1);
const passwordComplexity = z.string().refine(v => v.length > 6, {
  params: {
    i18n: { key: "password_complexity" },
  },
});
const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits long");

const WizardFormView = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _wizardSchema = z.object({
    firstName: z.string().min(6),
    lastname: z.string().min(6),
    email: z.string().email(),
    password: z.string().refine(v => v.length > 6, {
      params: {
        i18n: { key: "password_complexity" },
      },
    }),
    phone: z.string().min(10),
    billingAddress: z.string().min(1),
    shippingAddress: z.string().min(1),
    newsletter: z.boolean(),
    specialOffers: z.boolean(),
    smsNotifications: z.boolean(),
  });
  type Schema = z.infer<typeof _wizardSchema>;
  const onSubmit = async (values: Schema) => {
    await sleep(300);
    window.alert(JSON.stringify(values, null, 2));
  };
  const { t } = useTranslation();
  return (
    <Box>
      <Heading>{t("wizard_form_title")}</Heading>
      <Box marginTop={"20px"}>
        <Wizard<Schema> onSubmit={onSubmit}>
          <WizardPage>
            <Stack spacing={4}>
              <Field name="firstName" validate={zod2FieldValidator(required)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="text" placeholder={t("wizard_first_name_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="lastName" validate={zod2FieldValidator(required)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="text" placeholder={t("wizard_last_name_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="email" validate={zod2FieldValidator(emailSchema)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="email" placeholder={t("wizard_email_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={zod2FieldValidator(passwordComplexity)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="password" placeholder={t("wizard_password_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Stack>
          </WizardPage>
          <WizardPage>
            <Stack spacing={4}>
              <Field name="phone" validate={zod2FieldValidator(phoneSchema)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="text" placeholder={t("wizard_phone_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="billingAddress" validate={zod2FieldValidator(required)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="text" placeholder={t("wizard_billing_address_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="shippingAddress" validate={zod2FieldValidator(required)}>
                {({ input, meta: { error, touched } }) => (
                  <FormControl isInvalid={error && touched}>
                    <Input {...input} type="text" placeholder={t("wizard_shipping_address_placeholder")} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Stack>
          </WizardPage>
          <WizardPage>
            <Stack spacing={4}>
              <CharkaCheckBoxFinalFormField name="newsletter" label={t("wizard_newsletter_label")} />
              <CharkaCheckBoxFinalFormField name="specialOffers" label={t("wizard_special_offers_label")} />
              <CharkaCheckBoxFinalFormField name="smsNotifications" label={t("wizard_sms_notifications_label")} />
            </Stack>
          </WizardPage>
        </Wizard>
      </Box>
    </Box>
  );
};
export default WizardFormView;
