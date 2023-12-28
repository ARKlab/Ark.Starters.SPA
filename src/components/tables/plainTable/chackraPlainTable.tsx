import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center,
  Spinner,
} from "@chakra-ui/react";

export type PlainTablePropsType<T> = {
  data: T[];
  colorscheme?: string;
  variant?: string;
  isLoading: boolean;
  isError: boolean;
};

export const ChackraPlainTable = <T,>({
  data,
  colorscheme = "grey",
  variant = "striped",
  isLoading,
  isError,
}: PlainTablePropsType<T>) => {
  const headers = Object.keys(data[0] || {});

  return (
    <TableContainer my="30px">
      <Table variant={variant} colorScheme={colorscheme}>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading || isError || !data ? (
            <Tr>
              <Td colSpan={headers.length}>
                <Center>
                  <Spinner />
                </Center>
              </Td>
            </Tr>
          ) : (
            data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header) => (
                  <Td key={header}>{(row as any)[header]}</Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
