import { Box } from "@chakra-ui/react";

import { FeatureErrorBoundary } from "../../lib/components/FeatureErrorBoundary/FeatureErrorBoundary";

import ConfigTable from "./configTable";

const ConfigTableExampleView = () => {
  return (
    <Box>
      <FeatureErrorBoundary featureLabel="Config Table">
        <ConfigTable />
      </FeatureErrorBoundary>
    </Box>
  );
};

export default ConfigTableExampleView;
