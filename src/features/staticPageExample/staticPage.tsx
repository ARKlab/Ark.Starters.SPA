import { Box, Code, Heading } from "@chakra-ui/react";

const NoEntryPoint = () => {
  return (
    <Box p={"5"} marginTop={"12"}>
      <Heading mb={"5"}>
        Please choose an EntryPoint in your siteMap sections using <Code>isEntryPoint</Code> flag
      </Heading>
    </Box>
  );
};

export default NoEntryPoint;
