import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface ConsoleCardProps {
  logs: { name: string; value: unknown }[];
  setLogs: React.Dispatch<React.SetStateAction<{ name: string; value: unknown }[]>>;
}

const ConsoleCard: React.FC<ConsoleCardProps> = ({ logs, setLogs }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" padding="10px" marginTop="20px">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">Console</Text>
        <Button
          onClick={() => {
            setLogs([]);
          }}
          size={"xs"}
        >
          Clear
        </Button>
      </Flex>
      {logs.map((log, index) => (
        <Text key={index}>{`${log.name}: ${JSON.stringify(log.value)}`}</Text>
      ))}
    </Box>
  );
};

export default ConsoleCard;
