import React, { useState, ReactNode } from "react";
import { Form } from "react-final-form";
import {
  Button,
  Box,
  Card,
  UnorderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";

export const Wizard = ({
  onSubmit,
  children,
}: {
  onSubmit: (v: string | number) => void;
  children: ReactNode;
}) => {
  const [page, setPage] = useState(0);
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;

  const next = () =>
    setPage(Math.min(page + 1, React.Children.count(children) - 1));

  const previous = () => setPage(Math.max(page - 1, 0));

  const handleSubmit = (values: string | number) => {
    if (isLastPage) {
      return onSubmit(values);
    } else {
      next();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit}>
          <Box>{activePage}</Box>
          <Box className="buttons" mt={4}>
            {page > 0 && (
              <Button type="button" onClick={previous}>
                « Previous
              </Button>
            )}
            {!isLastPage && <Button type="submit">Next »</Button>}
            {isLastPage && (
              <Button type="submit" disabled={submitting}>
                Submit
              </Button>
            )}
          </Box>

          <Card mt={4} padding={"10px"} bgColor={"brand.primary"} w={"300px"}>
            <Text>Form Data:</Text>
            <UnorderedList>
              {Object.entries(values).map(([key, value]) => (
                <ListItem key={key}>
                  {key}: {value}
                </ListItem>
              ))}
            </UnorderedList>
          </Card>
        </form>
      )}
    />
  );
};

export const WizardPage = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);
