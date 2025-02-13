import { Code, type CodeProps } from "@chakra-ui/react";
import React from "react";

export default function CodeBlock({ children, ...rest }: { children?: React.ReactNode } & CodeProps) {
  return (
    <Code {...rest} display="block" whiteSpace="pre" textAlign="start">
      {children}
    </Code>
  );
}
