import type { ChakraProps } from '@chakra-ui/react'
import { Code } from '@chakra-ui/react'
import React from 'react'

export default function CodeBlock({
  children,
  ...rest
}: { children?: React.ReactNode } & ChakraProps) {
  return (
    <Code {...rest} display="block" whiteSpace="pre" textAlign="start">
      {children}
    </Code>
  )
}
