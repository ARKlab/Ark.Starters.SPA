import { Box, Button, Card, Flex, List, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Children, useState } from "react";
import type { UseFormProps } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";

type WizardProps<SchemaType extends object> = {
  onSubmit: (v: SchemaType) => void;
  children: ReactNode;
  formProps?: UseFormProps<SchemaType>;
};

export function Wizard<SchemaType extends object>(props: WizardProps<SchemaType>) {
  const { onSubmit, children, formProps } = props;

  const [page, setPage] = useState(0);
  const activePage = Children.toArray(children)[page];
  const isLastPage = page === Children.count(children) - 1;

  const next = () => {
    setPage(Math.min(page + 1, Children.count(children) - 1));
  };

  const previous = () => {
    setPage(Math.max(page - 1, 0));
  };

  const form = useForm(formProps);

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = form;

  const _onSubmit = (values: SchemaType) => {
    if (isLastPage) {
      onSubmit(values);
    } else {
      next();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(_onSubmit)}>
        <Box>{activePage}</Box>

        <Box className="buttons" mt="4">
          <Flex gap="5">
            {page > 0 && (
              <Button type="button" onClick={previous}>
                « Previous
              </Button>
            )}
            {!isLastPage && (
              <>
                <Button type="submit">Next »</Button>
              </>
            )}
            {isLastPage && (
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            )}
          </Flex>
        </Box>

        <Card.Root mt="4" p="2" px="4" bg="brand.solid" w="full">
          <Text fontWeight={"bold"}>Form Data:</Text>

          <List.Root>
            {Object.entries(getValues()).map(([key, value]) => (
              <List.Item key={key}>
                {key}: <b>{String(value)}</b>
              </List.Item>
            ))}
          </List.Root>
        </Card.Root>
      </form>
    </FormProvider>
  );
}

export const WizardPage = ({ children }: { children: ReactNode }) => <Box>{children}</Box>;
