import { Box, Heading, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { CheckboxControl, InputControl } from "../../components/formControls";
import { Wizard, WizardPage } from "../../components/wizard/wizard";

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  phone: z.string().min(10, "Phone number must be at least 10 digits long"),
  billingAddress: z.string().min(1),
  shippingAddress: z.string().min(1),
  newsletter: z.boolean(),
  specialOffers: z.boolean(),
  smsNotifications: z.boolean(),
});
type Schema = z.infer<typeof _wizardSchema>;

export default function WizardFormView() {
  const { t } = useTranslation();

  const onSubmit = async (values: Schema) => {
    await sleep(300);
    window.alert(JSON.stringify(values, null, 2));
  };

  return (
    <Box>
      <Heading>{t("wizard_form_title")}</Heading>
      <Box marginTop={"20px"}>
        <Wizard<Schema> onSubmit={onSubmit}>
          <WizardPage>
            <Stack spacing={4}>
              <InputControl name="firstName"  label='Last name' placeholder={t("wizard_first_name_placeholder")} />
              <InputControl name="lastName"   label='Last name' placeholder={t("wizard_last_name_placeholder")} />
              <InputControl name="email"      label='E-mail'    placeholder={t("wizard_email_placeholder")} />
              <InputControl name="password"   label='Password'  placeholder={t("wizard_password_placeholder")} inputProps={{ type: 'password' }} />
            </Stack>
          </WizardPage>

          <WizardPage>
            <Stack spacing={4}>
              <InputControl name="phone"           label="Phone"            placeholder={t("wizard_phone_placeholder")} />
              <InputControl name="billingAddress"  label="Billing address"  placeholder={t("wizard_billing_address_placeholder")} />
              <InputControl name="shippingAddress" label="Shipping address" placeholder={t("wizard_shipping_address_placeholder")} />
            </Stack>
          </WizardPage>

          <WizardPage>
            <Stack spacing={4}>
              <CheckboxControl name="newsletter"       label={t("wizard_newsletter_label")} />
              <CheckboxControl name="specialOffers"    label={t("wizard_special_offers_label")} />
              <CheckboxControl name="smsNotifications" label={t("wizard_sms_notifications_label")} />
            </Stack>
          </WizardPage>
        </Wizard>
      </Box>
    </Box>
  );
};
