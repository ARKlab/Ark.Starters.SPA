import { Box } from "@chakra-ui/react";
import ConfigTable, { Employee } from "./configTable";
import { useGetConfigQuery } from "./configTableApi";

const ConfigTableExampleView = () => {
  return (
    <Box my="70px">
      <ConfigTable />
    </Box>
  );
};

export default ConfigTableExampleView;
