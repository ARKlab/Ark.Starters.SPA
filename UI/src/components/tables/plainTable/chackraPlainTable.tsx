import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";

export type PlainTablePropsType = {
  headers: string[];
  body: any;
  colorscheme?: string;
  variant?: string;
};
export const ChackraPlainTable = ({
  headers,
  body,
  colorscheme = "grey.100",
  variant = "",
}: PlainTablePropsType) => {
  return (
    <TableContainer my="30px">
      <Table variant={variant} colorScheme={colorscheme}>
        <Thead>
          <Tr>
            {headers.map((x) => (
              <Th key={x}>{x}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{body}</Tbody>
      </Table>
    </TableContainer>
  );
};
