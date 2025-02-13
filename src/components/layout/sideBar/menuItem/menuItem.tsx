import { Link as ChakraLink, Flex, Icon, Text, WrapItem } from "@chakra-ui/react";
import { useMemo } from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";

import type { SubsectionMenuItemType } from "./types";

type MenuItemProps = Omit<SubsectionMenuItemType, "isInMenu" | "component" | "authenticatedOnly">;

export default function MenuItem(props: MenuItemProps) {
  const { label, path = "", icon, externalUrl } = props;

  const location = useLocation();

  const isActive = useMemo(() => location.pathname.startsWith(path), [location, path]);
  return (
    <ChakraLink _hover={{ textDecoration: "none" }} asChild>
      <ReactRouterLink to={externalUrl ?? path} target={externalUrl ? "_blank" : undefined}>
        <WrapItem
          _hover={{
            background: "brand.primary",
            color: "brandPalette.900",
            transitionDuration: "0.4s",
            transitionTimingFunction: "ease-in-out",
          }}
          background={isActive ? "brand.selected" : undefined}
          p={".25em 1em"}
        >
          <Flex justifyContent="space-between" alignItems="center" width="100%" height={"2.5em"}>
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
      </ReactRouterLink>
    </ChakraLink>
  );
}
