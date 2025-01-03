import {
  Box,
  Button,
  Card,
  Flex,
  Text
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Children, useState } from "react";
import type { FieldValues, UseFormProps } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";

type WizardProps<SchemaType extends FieldValues> = {
  onSubmit: (v: SchemaType) => void;
  children: ReactNode;
  formProps?: UseFormProps<SchemaType>;
};

export function Wizard<SchemaType extends object>(props: WizardProps<SchemaType>) {
  const { onSubmit, children, formProps } = props;

  const [page, setPage] = useState(0);
  const activePage = Children.toArray(children)[page];
  const isLastPage = page === Children.count(children) - 1;

  const next = () => { setPage(Math.min(page + 1, Children.count(children) - 1)); };

  const previous = () => { setPage(Math.max(page - 1, 0)); };

  const form = useForm<SchemaType>(formProps);
  
  const { handleSubmit, formState: { isSubmitting }, getValues } = form;

  const _onSubmit = (values: SchemaType) => {
    if (isLastPage) {
      onSubmit(values); return;
    } else {
      next();
    }
  };

  return <FormProvider {...form}>
    <form onSubmit={handleSubmit(_onSubmit)}>
      <Box>
        {activePage}
      </Box>

      <Box className="buttons" mt={4}>
        <Flex gap={"20px"}>
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

      <Card mt={4} padding={".5rem 1rem"} bgColor={"brand.primary"} w={"50%s"}>
        <Text fontWeight={'bold'}>
          Form Data:
        </Text>

        <pre>{JSON.stringify(getValues(), null, 2)}</pre>
      </Card>
    </form>
  </FormProvider>;
};

export const WizardPage = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);
