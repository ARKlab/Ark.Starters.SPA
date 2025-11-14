import { Box, Flex, Field, Heading, Input, Text, VStack, FieldLabel, StackSeparator } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { toaster } from "../../components/ui/toaster";
import { LocaleSwitcher } from "../../lib/i18n/localeSwitcher";
/**
 * This will be used as a Resolver and Validator
 * to convert the form data into a schema
 */
const FormSchema = z.object({
  labelName: z.string().max(6),
  fieldName: z.string(),
  customErrorInline: z
    // Initially accepts a string
    .string()
    // Transforms the string into a number
    .transform(val => Number(val))
    // Validates that the number is less than 3
    .refine(x => x < 3, {
      params: {
        i18n: { key: "custom_error" },
      },
    }),
});

export default function LocalizationPage() {
  const { t } = useTranslation();
  const [apples, setApples] = useState(0);

  function onSubmit() {
    toaster.create({
      title: t("localization-samples.submit"),
      description: t("localization-samples.submit-message"),
    });
  }

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  return (
    <Box>
      <Heading lineClamp={1} size="xl">
        {t("localization-samples.title")} <LocaleSwitcher />
      </Heading>
      <VStack separator={<StackSeparator borderColor="border" />} gap={4} align="stretch">
        <Box my="5px" borderRadius={"md"} p={"20px"} bg={"header"}>
          <Heading lineClamp={1} size="md">
            <strong>{t("localization_simple_text")}</strong>
          </Heading>
          <Text>{t("hello_world")}</Text>
        </Box>

        <Box my="5px" borderRadius={"md"} p={"20px"} bg={"header"}>
          <Heading size={"md"}>
            <strong>{t("form_error")}:</strong>
          </Heading>
          <pre>{JSON.stringify(errors, (k: string, v: unknown) => (k !== "ref" ? v : ""), 2)}</pre>

          <Flex as={"form"} onSubmit={handleSubmit(onSubmit)} display={"flex"} gap={"1rem"} flexFlow={"column"}>
            <Heading size={"md"}>
              <strong>{t("form_values")}:</strong>
            </Heading>

            <Field.Root invalid={!!errors.labelName} disabled={isSubmitting}>
              <FieldLabel htmlFor="labelName">{t("name")}</FieldLabel>
              <Input id="labelName" {...register("labelName")} />
              <Field.ErrorText>{errors.labelName?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.fieldName} disabled={isSubmitting}>
              <FieldLabel htmlFor="fieldName">FieldName</FieldLabel>
              <Input id="fieldName" {...register("fieldName")} />
              <Field.ErrorText>{errors.fieldName?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.customErrorInline} disabled={isSubmitting}>
              <FieldLabel htmlFor="customErrorInline">{t("translation-samples.custom-error")}</FieldLabel>
              <Input id="customErrorInline" {...register("customErrorInline")} type="number" />
              <Field.ErrorText>{errors.customErrorInline?.message}</Field.ErrorText>
            </Field.Root>
          </Flex>
        </Box>
        <Box my="5px" borderRadius={"md"} p={"20px"} bg={"header"}>
          <Heading lineClamp={1} size="md">
            <strong>{t("localization_dynamic_text")}</strong>
          </Heading>
          <Text my="5px" fontSize={"sm"}>
            {t("localization_dynamic_text_explanation")}
          </Text>
          <Field.Root>
            {t("localization_control_label")}
            <Input
              w="10em"
              id="apples"
              type="number"
              value={apples}
              onChange={e => {
                setApples(Number(e.target.value));
              }}
            />
          </Field.Root>
          <Text my="3">{t("localization_example_1", { number: apples })}</Text>
        </Box>
      </VStack>
    </Box>
  );
}
