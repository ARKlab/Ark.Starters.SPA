import { Box, Flex, Field, Heading, Input, Text, VStack, FieldLabel, StackSeparator } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { Toaster, toaster } from "../../components/ui/toaster";
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

/**
 * This will be used to infer the type of the form data
 */
type FormSchemaType = z.infer<typeof FormSchema>;

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
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  console.log(watch("labelName"));
  console.log("errors: ", errors);

  return (
    <Box>
      <Heading lineClamp={1} size="xl">
        {t("localization-samples.title")}
      </Heading>
      <VStack separator={<StackSeparator borderColor="gray.200" />} gap={4} align="stretch">
        <Box my="20px">
          <Heading lineClamp={1} size="md">
            {t("localization-samples.locale-switcher")}
          </Heading>
          <LocaleSwitcher />
        </Box>

        <Box my="20px">
          <Heading lineClamp={1} size="md">
            {t("localization_simple_text")}
          </Heading>
          <Text>{t("hello_world")}</Text>
        </Box>

        <Box>
          <Heading size={"md"}>
            <strong>Form errors:</strong>
          </Heading>
          <pre>{JSON.stringify(errors, (k: string, v: unknown) => (k !== "ref" ? v : ""), 2)}</pre>
        </Box>

        <Flex as={"form"} onSubmit={handleSubmit(onSubmit)} display={"flex"} gap={"1rem"} flexFlow={"column"}>
          <Heading size={"md"}>
            <strong>Form values:</strong>
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

        <Box my="20px">
          <Heading lineClamp={1} size="md">
            {t("localization_dynamic_text")}
          </Heading>
          <Text my="10px" fontSize={"sm"}>
            {t("localization_dynamic_text_explanation")}
          </Text>
          <Field.Root>
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
          </Field.Root>
          <Text fontSize="2xl">{t("localization_example_1", { number: apples })}</Text>
        </Box>
      </VStack>
      <Toaster />
    </Box>
  );
}
