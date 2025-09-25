import { Box, Link as ChakraLink, Grid, Icon, Text, WrapItem } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";

import type { SubsectionMenuItemType } from "./types";

type MenuItemProps = Omit<SubsectionMenuItemType, "isInMenu" | "component" | "authenticatedOnly">;

export default function MenuItem(props: MenuItemProps) {
  const { label, path = "", icon, externalUrl } = props;
  return (
    <ChakraLink asChild outline={"none"} _hover={{ textDecoration: "none" }}>
      <ReactRouterLink to={externalUrl ?? path} target={externalUrl ? "_blank" : undefined}>
        <WrapItem>
          <Grid
            templateColumns="auto 1fr auto"
            alignItems="center"
            width={"100%"}
            height={"2.5em"}
            color={"brand.contrast"}
            gap={3}
          >
            {icon && (
              <Icon
                ml="1"
                fontSize="1em"
                _groupHover={{
                  color: "brandPalette.900",
                }}
                as={icon}
              />
            )}
            <Text>{label}</Text>
            <Box width="1em" /> {/* Placeholder to ensure consistent spacing */}
          </Grid>
        </WrapItem>
      </ReactRouterLink>
    </ChakraLink>
  );
}
