import { Box, Container, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react'
import { MdClose } from 'react-icons/md'
import { Link } from 'react-router-dom'

import CodeBlock from './codeBlock'

export function ErrorDisplay({
  name,
  message,
  stack,
}: {
  name?: string
  message?: string
  stack?: string
}) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="red.500"
          rounded="50px"
          w="55px"
          h="55px"
          textAlign="center"
        >
          {/*<Icon as={MdClose} boxSize="20px" color="white" />*/} {/* Using React Icons */}
        </Flex>
      </Box>
      <Container centerContent>
        <VStack w="100%">
          <Heading as={Link} size="md" mt={6} mb={2} textDecoration="underline">
            <Link to="" reloadDocument>
              Force Reload{" "}
            </Link>
          </Heading>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            {name ?? "Sorry, unknown error."}
          </Heading>
          <Text color="gray.500">{message}</Text>
          <CodeBlock>{stack}</CodeBlock>
        </VStack>
      </Container>
    </Box>
  );
}
