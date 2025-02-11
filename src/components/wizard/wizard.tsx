import {
  Button,
  Box,
  Card,
  List,
  ListItem,
  Text,
  Flex,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useState, Children } from "react";
import { Form } from "react-final-form";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function Wizard<SchemaType extends object>({
  onSubmit,
  children
}: {
  onSubmit: (v: SchemaType) => void;
  children: ReactNode;
}) {
  const [page, setPage] = useState(0);
  const activePage = Children.toArray(children)[page];
  const isLastPage = page === Children.count(children) - 1;

  const next = () => { setPage(Math.min(page + 1, Children.count(children) - 1)); };

  const previous = () => { setPage(Math.max(page - 1, 0)); };

  const handleSubmit = (values: SchemaType) => {
    if (isLastPage) {
      onSubmit(values); return;
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

            <Card.Root mt={4} padding={"10px"} bgColor={"brand.primary"} w={"300px"}>
              <Text>Form Data:</Text>
              <List.Root>
                {Object.entries(values).map(([key, value]) => (
                  <ListItem key={key}>
                    {key}: <b>{String(value)}</b>
                  </ListItem>
                ))}
              </List.Root>
            </Card.Root>
          </form>
        );
      }}
    />
  );
};

export const WizardPage = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);
