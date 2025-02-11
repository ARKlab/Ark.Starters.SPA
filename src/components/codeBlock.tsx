
import { Code } from '@chakra-ui/react'
import React from 'react'

export default function CodeBlock({ children, ...rest }: { children?: React.ReactNode }) {
  return (
    <Code {...rest} display="block" whiteSpace="pre" textAlign="start">
      {children}
    </Code>
  );
}
