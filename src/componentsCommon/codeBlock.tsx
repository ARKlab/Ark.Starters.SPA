import React from 'react';
import { ChakraProps, Code } from '@chakra-ui/react';

export default function CodeBlock({children, ...rest}:{children?:React.ReactNode} & ChakraProps)
{
    return <Code {...rest} display="block" whiteSpace="pre" textAlign="start">
                {children}
            </Code>   
}