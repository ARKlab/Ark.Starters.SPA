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
} from '@chakra-ui/react'

export type PlainTablePropsType<T> = {
  data: T[]
  colorscheme?: string
  variant?: string
  isLoading: boolean
  isError: boolean
}

export const ChackraPlainTable = <T extends object,>({
  data,
  colorscheme = 'grey',
  variant = 'striped',
  isLoading,
  isError,
}: PlainTablePropsType<T>) => {
  type TK = keyof T
  const first = data.length < 1 ? {} : data[0];

  /* TODO: this doesn't work well as
   * Typescript doesn't support compile-time to derive the properties of T
   * At runtime, the Array may be empty and thus cannot be derived either
   * Solutions:
   *   1. move responsability to developer
   *   2. use Zod schema, pairing T with Schema: z.object({...}).shape contains the list of keys
   *      requires time to understand the right Generics to use 
   */
  const headers = Object.keys(first) as TK[]

  return (
    <TableContainer my="30px">
      <Table variant={variant} colorScheme={colorscheme}>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={String(header)}>{String(header)}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading || isError ? (
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
                  <Td key={String(header)}>{row[header] as any}</Td> // eslint-disable-line @typescript-eslint/no-explicit-any
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
