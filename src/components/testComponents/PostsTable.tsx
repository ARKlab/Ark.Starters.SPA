import {
  Button,
  Center,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useFetchPostsQuery } from "../../features/api/jsonPlaceholderAPI/jsonPlaceholderSlice";
import { PostDataType } from "../../features/api/jsonPlaceholderAPI/jsonPlaceholderTypes";
import { ChackraPlainTable } from "../tables/plainTable/chackraPlainTable";
const PostsTable = () => {
  const {
    data,
    isLoading,
    isError,
  } /*This also contains error and isSuccess*/ = useFetchPostsQuery(null, {
    pollingInterval: 30000,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  let headers = ["ID", "User ID", "Title", "Body"];
  return (
    <>
      <Button colorScheme="brandPalette">TestButton </Button>
      <ChackraPlainTable
        colorscheme="teal"
        variant="striped"
        data={data || []}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
};

export default PostsTable;
