import { Flex, Link as ChakraLink, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import type { SubsectionMenuItemType } from "./types";

export default function MenuItem({
  label,
  path,
  icon,
  externalUrl,
}: Omit<SubsectionMenuItemType, "isInMenu" | "component" | "authenticatedOnly">) {
  return (
    <ChakraLink
      _hover={{ textDecoration: "none" }}
      as={externalUrl ? "a" : ReactRouterLink}
      {...(externalUrl ? { href: externalUrl } : { to: path })}
      rel={externalUrl ? "noopener noreferrer" : undefined}
      onClick={() => {
        console.log(`MenuItem clicked: ${label}, Path: ${path}, External URL: ${externalUrl}`);
      }}
    >
      <Flex
        align="center"
        _hover={{
          background: "brand.primary",
          color: "brandPalette.900",
          transitionDuration: "0.4s",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <Flex justifyContent="space-between" alignItems="center" width="100%" height={"2.5em"}>
          <Text mx="5">{label}</Text>
          {icon &&
            React.createElement(icon, {
              fontSize: "1em",    
            })}
        </Flex>
      </Flex>
    </ChakraLink>
  );
}
