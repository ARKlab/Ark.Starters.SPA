import { Box, Heading, StackDivider, VStack, Text, useToast, FormControl, Input, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LocaleSwitcher } from "./localeSwitcher";
import { Field, Form } from "react-final-form";
import z from 'zod';
import { zod2FormValidator } from "../../lib/zod2FormValidator";

const TestSchema = z.object({
    name: z.string().min(6),
    fieldName: z.string().email(),
    customErrorInline: z.number().refine(x => x < 3, {
        params: {
            i18n: { key: "custom_error",  },
        }
    })
});

// extract the inferred type like this
type Test = z.infer<typeof TestSchema>;

const LocalizationPage = () => {
    const { t } = useTranslation();
    const toast = useToast();

    const submit = () => {
        toast({
            title: "Submitted",
            description: "nice!"
        });
    };

    const p = (v: number) => {
        return Number(v);
    }

    return (
        <Box>
            <Heading noOfLines={1} size='xl'>Localization samples</Heading>
            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                align='stretch'
            >
                <Box>
                    <Heading noOfLines={1} size='md'>Locale Switcher</Heading>
                    <LocaleSwitcher />
                </Box>
                <Box>
                    <Heading noOfLines={1} size='md'>Simple Text Translation</Heading>
                    <Text>{t('hello_world')}</Text>
                </Box>
                <Box>
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
                                                <FormControl
                                                    isInvalid={error && touched}
                                                    isDisabled={submitting}
                                                >
                                                    <FormLabel htmlFor='name'>Name</FormLabel>
                                                    <Input
                                                        {...input}
                                                    />
                                                    <FormErrorMessage>{error}</FormErrorMessage>
                                                </FormControl>
                                            );
                                        }}
                                    />

                                    <Field<string>
                                        name="fieldName"
                                        type="text"
                                        render={({ input, meta: { error, touched } }) => {
                                            return (
                                                <FormControl
                                                    isInvalid={error && touched}
                                                    isDisabled={submitting}
                                                >
                                                    <FormLabel htmlFor='fieldName'>FieldName</FormLabel>
                                                    <Input
                                                        {...input}
                                                    />
                                                    <FormErrorMessage>{error}</FormErrorMessage>
                                                </FormControl>
                                            );
                                        }}
                                    />

                                    <Field<number>
                                        name="customErrorInline"
                                        type="number"
                                        parse={p}
                                        render={({ input, meta: { error, touched } }) => {
                                            return (
                                                <FormControl
                                                    isInvalid={error && touched}
                                                    isDisabled={submitting}
                                                >
                                                    <FormLabel htmlFor='customErrorInline'>Custom Error</FormLabel>
                                                    <Input {...input} />

                                                    <FormErrorMessage>{error}</FormErrorMessage>
                                                </FormControl>
                                            );
                                        }}
                                    />
                                </form>
                            );
                        }}
                    />
                </Box>
            </VStack>
        </Box>

    )
}

export default LocalizationPage;