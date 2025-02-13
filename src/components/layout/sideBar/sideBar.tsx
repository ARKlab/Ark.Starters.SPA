//#region Imports
import { Box, useBreakpointValue, type BoxProps } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";

import useRouteChanged from "../../../lib/useRouteChanged";
import { mainSections } from "../../../siteMap/mainSections";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../../ui/accordion";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
} from "../../ui/drawer";
import { useLayoutContext } from "../useLayoutContext";

import MenuItem from "./menuItem/menuItem";
import type { SubsectionMenuItemType } from "./menuItem/types";

export default function SimpleSidebar() {
  const { isMobileSiderOpen, setMobileSiderOpen } = useLayoutContext();

  const closeDrawer = useCallback(() => {
    setMobileSiderOpen(false);
  }, [setMobileSiderOpen]);

  // close drawer after clicking / navigating
  useRouteChanged(closeDrawer);

  // close drawer if screen gets bigger while drawer is open
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  useEffect(() => {
    if (isDesktop) closeDrawer();
  }, [isDesktop, closeDrawer]);

  return (
    <>
      <SidebarContent display={{ base: "none", lg: "block" }} w={60} h={"full"} borderRight="1px" bg={"sider.bg"} />
      <DrawerRoot
        open={isMobileSiderOpen}
        placement="end"
        onOpenChange={e => {
          setMobileSiderOpen(e.open);
        }}
      >
        <DrawerBackdrop />
        <DrawerContent bg={"sider.bg"}>
          <DrawerCloseTrigger />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <SidebarContent key={"SideBarContent"} />
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
}

const SidebarContent = ({ ...rest }: BoxProps) => {
  return (
    <Box as={"nav"} {...rest}>
      <AccordionRoot borderStyle={"none"} borderWidth={0} collapsible multiple>
        {mainSections.map((section, index) => (
          <AccordionItem
            value={section.label + "accordionItem" + index}
            border="none"
            key={section.label + "accordionItem" + index}
          >
            <h2>
              <AccordionItemTrigger
                key={section.label + "accordionButton" + index}
                _hover={{
                  background: "brand.primary",
                  color: "brandPalette.900",
                }}
              >
                <Box as="span" flex="1" textAlign="left">
                  {section.label}
                </Box>
              </AccordionItemTrigger>
            </h2>

            <AccordionItemContent p={0} key={section.label + "accordionPanel" + index}>
              {section.subsections?.map((x, indexSub) =>
                x.isInMenu ? (
                  doINeedAnInnerAccordion(x) ? (
                    <InnerAccordionSections
                      key={x.path + "innerAccordionSections" + indexSub}
                      section={x}
                      parentPath={[section.path, x.path].join("/")}
                    />
                  ) : (
                    <MenuItem
                      key={x.path + "menuItem" + indexSub}
                      path={[section.path, x.path].join("/")}
                      externalUrl={x.externalUrl}
                      label={x.label}
                      icon={x.icon}
                    />
                  )
                ) : null,
              )}
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Box>
  );
};

function doINeedAnInnerAccordion(section: SubsectionMenuItemType) {
  return (
    section.subsections && section.subsections.length > 0 && section.subsections.filter(x => x.isInMenu).length > 0
  );
}

const InnerAccordionSections = (props: { section: SubsectionMenuItemType; parentPath: string }) => {
  const section = props.section;
  if (section.subsections)
    return (
      <AccordionRoot
        collapsible
        multiple
        my="0px"
        borderStyle={"hidden"}
        key={section.path + "accordion"}
        width={"100%"}
        mx={"1"}
        borderWidth={0}
      >
        <AccordionItem
          value={section.path + "AccordionItemInner"}
          key={section.path + "AccordionItemInner"}
          border="none"
        >
          <h2>
            <AccordionItemTrigger
              key={section.path + "AccordionButtonInner"}
              _hover={{
                background: "brand.primary",
                color: "brandPalette.900",
              }}
            >
              <Box as="span" flex="1" textAlign="left">
                {section.label}
              </Box>
            </AccordionItemTrigger>
          </h2>
          <AccordionItemContent pb={4} key={section.path + "AccordionPanelInner"}>
            {section.subsections.map((x, index) =>
              x.isInMenu ? (
                <MenuItem
                  key={x.path + "AccordionMenuItemInner" + index}
                  path={[props.parentPath, x.path].join("/")}
                  externalUrl={x.externalUrl}
                  label={x.label}
                  icon={x.icon}
                />
              ) : null,
            )}
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    );
  else return <></>;
};
