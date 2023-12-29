import { Link as ReactRouterLink } from "react-router-dom";
import {
  Flex,
  Link as ChakraLink,
  Icon,
  Text,
  WrapItem,
} from "@chakra-ui/react";
import { SubsectionMenuItemType } from "./types";

export default function MenuItem({
  label,
  path,
  component,
  icon,
  isExternal,
}: Omit<SubsectionMenuItemType, "isInMenu">) {
  return (
    <ChakraLink
      _hover={{ textDecoration: "none" }}
      as={ReactRouterLink}
      to={path}
      isExternal={isExternal}
    >
      <WrapItem
        _hover={{
          background: "brand.primary",
          color: "brandPalette.900",
          transitionDuration: "0.4s",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          height={"2.5em"}
        >
          <Text mx="5">{label}</Text>
          {icon && (
            <Icon
              mr="0"
              fontSize="1em"
              _groupHover={{
                color: "brandPalette.900",
              }}
              as={icon}
            />
          )}
        </Flex>
      </WrapItem>
    </ChakraLink>
  );
}
