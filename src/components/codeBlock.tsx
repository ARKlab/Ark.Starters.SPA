import { Code, type CodeProps } from "@chakra-ui/react"
import React from "react"

export default function CodeBlock({
  children,
  ...rest
}: { children?: React.ReactNode } & CodeProps) {
  return (
    <Code variant={"subtle"} display="block" whiteSpace="pre" {...rest}>
      {children}
    </Code>
  )
}
