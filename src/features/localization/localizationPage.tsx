import { Box, Heading, VStack, Text, Input, Separator, FieldRoot } from "@chakra-ui/react";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { useTranslation } from "react-i18next";
import * as z from 'zod';

import { Field as FormField } from "../../components/ui/field";
import { toaster } from "../../components/ui/toaster-helper";
import { LocaleSwitcher } from "../../lib/i18n/localeSwitcher";
import { zod2FormValidator } from "../../lib/zod2FormValidator";


const TestSchema = z.object({
  name: z.string().min(6),
  fieldName: z.string().email(),
  customErrorInline: z.number().refine((x) => x < 3, {
    params: {
      i18n: { key: "custom_error" },
    },
  }),
});

// extract the inferred type like this
type Test = z.infer<typeof TestSchema>;

const LocalizationPage = () => {
  const { t } = useTranslation();
  const [apples, setApples] = useState(0);

  const submit = () => {
    toaster.create({
      title: t('localization-samples.submit'),
      description: t('localization-samples.submit-message'),
    });
  };

  const p = (v: number) => {
    return Number(v);
  };

  return (
    <Box>
      <Heading size="xl">{t("localization-samples.title")}</Heading>
      <VStack separator={<Separator borderColor="gray.200" />} gap={4} align="stretch">
        <Box my="20px">
          <Heading size="md">{t("localization-samples.locale-switcher")}</Heading>
          <LocaleSwitcher />
        </Box>
        <Box my="20px">
          <Heading size="md">{t("localization_simple_text")}</Heading>
          <Text>{t("hello_world")}</Text>
        </Box>
        <Box my="20px">
          <Form<Test>
            onSubmit={submit}
            validate={zod2FormValidator(TestSchema)}
            render={({ handleSubmit, submitting }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field<string>
                    name="name"
                    type="text"
                    render={({ input, meta: { error, touched } }) => {
                      return (
                        <FormField invalid={!!error && touched} disabled={submitting} title={t("name")} errorText={error}>
                          {/*<FormLabel htmlFor="name">{t("name")}</FormLabel>*/}
                          <Input {...input} />
                        </FormField>
                      );
                    }}
                  />

                  <Field<string>
                    name="fieldName"
                    type="text"
                    render={({ input, meta: { error, touched } }) => {
                      return (
                        <FormField invalid={!!error && touched} disabled={submitting} title={"FieldName"} errorText={error}>
                          {/*<FormLabel htmlFor="fieldName">FieldName</FormLabel>*/}
                          <Input {...input} />
                        </FormField>
                      );
                    }}
                  />

                  <Field<number>
                    name="customErrorInline"
                    type="number"
                    parse={p}
                    render={({ input, meta: { error, touched } }) => {
                      return (
                        <FormField invalid={!!error && touched} disabled={submitting} title={t("translation-samples.custom-error")} errorText={error}>
                          {/*<FormLabel htmlFor="customErrorInline">{t("translation-samples.custom-error")}</FormLabel>*/}
                          <Input {...input} />
                        </FormField>
                      );
                    }}
                  />
                </form>
              );
            }}
          />
        </Box>
        <Box my="20px">
          <Heading size="md">{t("localization_dynamic_text")}</Heading>
          <Text my="10px" fontSize={"sm"}>
            {t("localization_dynamic_text_explanation")}
          </Text>
          <FieldRoot>
            {t("localization_control_label")}
            <Input
              w="3em"
              id="apples"
              type="number"
              value={apples}
              onChange={e => {
                setApples(Number(e.target.value));
              }}
            />
          </FieldRoot>
          <Text fontSize="2xl">{t("localization_example_1", { number: apples })}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default LocalizationPage;
