import { Center, Spinner, Td, Tr } from "@chakra-ui/react";
import { useFetchPostsQuery } from "../../features/api/testApi/apiSlice";
import { PostDataType } from "../../features/api/testApi/types";
import { ChackraPlainTable } from "../tables/plainTable/chackraPlainTable";
const PostsTable = () => {
  const {
    data,
    isLoading,
    isError,
  } /*This also contains error and isSuccess*/ = useFetchPostsQuery(
    {
      //params here like page: page , limit: 20, skip: pagesize * (page - 1)
    },
    {
      pollingInterval: 30000,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );
  let headers = ["ID", "User ID", "Title", "Body"];
  return (
    <>
      <ChackraPlainTable
        colorscheme="grey.200"
        variant="striped"
        headers={headers}
        body={
          isLoading || isError || !data ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            data.map((post: PostDataType, index: number) => (
              <Tr key={index}>
                <Td>{post.id}</Td>
                <Td>{post.userId}</Td>
                <Td>{post.title}</Td>
                <Td>{post.body}</Td>
              </Tr>
            ))
          )
        }
      />
    </>
  );
};

export default PostsTable;
