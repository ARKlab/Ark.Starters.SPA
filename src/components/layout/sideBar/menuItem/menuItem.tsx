import { Box, Link as ChakraLink, Grid, Icon, Text, WrapItem } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

import type { SubsectionMenuItemType } from "./types";

type MenuItemProps = Omit<SubsectionMenuItemType, "isInMenu" | "component" | "authenticatedOnly">;

export default function MenuItem(props: MenuItemProps) {
  const { label, path = "", icon, externalUrl } = props;
  return (
    <ChakraLink asChild>
      <ReactRouterLink to={externalUrl ?? path} target={externalUrl ? "_blank" : undefined}>
        <WrapItem>
          <Grid
            templateColumns="auto 1fr auto"
            alignItems="center"
            width={"max-content"}
            height={"2.5em"}
            color={"brand.contrast"}
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
            <Text mx="5">{label}</Text>
            <Box width="1em" /> {/* Placeholder to ensure consistent spacing */}
          </Grid>
        </WrapItem>
      </ReactRouterLink>
    </ChakraLink>
  );
}
