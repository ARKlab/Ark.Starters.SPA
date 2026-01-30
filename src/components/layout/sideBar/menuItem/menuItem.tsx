import { Box, Link as ChakraLink, Grid, Icon, Text, WrapItem } from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router"

import type { ArkSubRoute } from "../../../../lib/siteMapTypes"

type MenuItemProps = Omit<ArkSubRoute, "isInMenu" | "component" | "authenticatedOnly">

export default function MenuItem(props: MenuItemProps) {
  const { label, path = "", icon, externalUrl } = props
  return (
    <ChakraLink asChild outline={"none"} _hover={{ textDecoration: "none" }}>
      <ReactRouterLink to={externalUrl ?? path} target={externalUrl ? "_blank" : undefined}>
        <WrapItem>
          <Grid
            templateColumns="auto 1fr auto"
            alignItems="center"
            width={"full"}
            height="10"
            color={"brand.contrast"}
            gap="3"
          >
            {icon && (
              <Icon
                ml="1"
                fontSize="md"
                _groupHover={{
                  color: "fg",
                }}
                as={icon}
              />
            )}
            <Text>{label}</Text>
            <Box width="4" /> {/* Placeholder to ensure consistent spacing */}
          </Grid>
        </WrapItem>
      </ReactRouterLink>
    </ChakraLink>
  )
}
