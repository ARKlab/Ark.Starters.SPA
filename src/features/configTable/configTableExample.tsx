import { Box } from "@chakra-ui/react";
import ConfigTable, { Employee } from "./configTable";
import { useGetConfigQuery } from "./configTableApi";

const ConfigTableExampleView = () => {
  const { data, isLoading: getConfigIsLoading } = useGetConfigQuery(null, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  
  return (
    <Box my="70px">
      <ConfigTable
        title={"Dipendenti"}
        data={data}
        isLoading={getConfigIsLoading}
      />
    </Box>
  );
};

export default ConfigTableExampleView;
