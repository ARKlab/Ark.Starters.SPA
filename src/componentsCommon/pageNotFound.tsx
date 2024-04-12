import { Box, Center, Heading, Image } from '@chakra-ui/react'
import React from 'react'

const PageNotFound = () => {
    return (
        <Box>
            <Center>
                <Heading as="h2" size="xl">
                    This page could not be found
                </Heading>
            </Center>
        </Box >
    )
}

export default PageNotFound