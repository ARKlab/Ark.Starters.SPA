import { Button } from "@chakra-ui/react";
import { ChackraPlainTable } from "../../components/tables/plainTable/chackraPlainTable";
import { useFetchSampleDataQuery } from "./authPlaygroundApiSlice";
const AuthPlaygroundTable = () => {
  const {
    data,
    isLoading,
    isError,
  } /*This also contains error and isSuccess*/ = useFetchSampleDataQuery(null, {
    pollingInterval: 30000,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  return (
    <>
      <Button colorScheme="brandPalette">TestButton </Button>
    </>
  );
};

export default AuthPlaygroundTable;
