import { Button } from '@chakra-ui/react'

import { ChackraPlainTable } from '../../components/tables/plainTable/chackraPlainTable'

import { useFetchPostsQuery } from './jsonPlaceholderSlice'
const JsonPlaceholderPostsTable = () => {
  const {
    data,
    isLoading,
    isError,
  } /*This also contains error and isSuccess*/ = useFetchPostsQuery(null, {
    pollingInterval: 30000,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })
  return (
    <>
      <Button colorScheme="brandPalette">TestButton</Button>
      <ChackraPlainTable
        colorscheme="teal"
        variant="striped"
        data={data || []}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  )
}

export default JsonPlaceholderPostsTable
