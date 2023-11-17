import { Link as ReactRouterLink } from "react-router-dom";
import {
  Center,
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
          color: "white",
          transitionDuration: "0.4s",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <Center height={"40px"}>
          <Text mx="5">{label}</Text>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
        </Center>
      </WrapItem>
    </ChakraLink>
  );
}
