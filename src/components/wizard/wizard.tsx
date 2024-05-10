import {
  Button,
  Box,
  Card,
  UnorderedList,
  ListItem,
  Text,
  Flex,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { Form } from "react-final-form";

export function Wizard<SchemaType extends object>({
  onSubmit,
  children
}: {
  onSubmit: (v: SchemaType) => void;
  children: ReactNode;
}) {
  const [page, setPage] = useState(0);
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;

  const next = () =>
    setPage(Math.min(page + 1, React.Children.count(children) - 1));

  const previous = () => setPage(Math.max(page - 1, 0));

  const handleSubmit = (values: SchemaType) => {
    if (isLastPage) {
      return onSubmit(values);
    } else {
      next();
    }
  };

  return (
    <Form<SchemaType>
      onSubmit={handleSubmit}
      render={({ handleSubmit, submitting, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box>{activePage}</Box>
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
                  <Button type="submit" disabled={submitting}>
                    Submit
                  </Button>
                )}
              </Flex>
            </Box>

            <Card mt={4} padding={"10px"} bgColor={"brand.primary"} w={"300px"}>
              <Text>Form Data:</Text>
              <UnorderedList>
                {Object.entries(values).map(([key, value]) => (
                  <ListItem key={key}>
                    {key}: <b>{String(value)}</b>
                  </ListItem>
                ))}
              </UnorderedList>
            </Card>
          </form>
        );
      }}
    />
  );
};

export const WizardPage = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);
