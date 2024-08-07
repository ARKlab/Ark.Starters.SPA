//#region Imports
import type { BoxProps } from "@chakra-ui/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";

import useRouteChanged from "../../../lib/useRouteChanged";
import { mainSections } from "../../../siteMap/mainSections";
import { useLayoutContext } from "../useLayoutContext";

import MenuItem from "./menuItem/menuItem";
import type { SubsectionMenuItemType } from "./menuItem/types";

export default function SimpleSidebar() {
  const { isMobileSiderOpen, setMobileSiderOpen } = useLayoutContext();

  const onClose = useCallback(() => {
    setMobileSiderOpen(false);
  }, [setMobileSiderOpen]);

  // close drawer after clicking / navigating
  useRouteChanged(onClose);

  // close drawer if screen gets bigger while drawer is open
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  useEffect(() => {
    if (isDesktop) onClose();
  }, [onClose, isDesktop]);

  return (
    <>
      <SidebarContent
        display={{ base: "none", lg: "block" }}
        w={60}
        h={"full"}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        bg={"sider.bg"}
      />
      <Drawer
        isOpen={isMobileSiderOpen}
        placement="right"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg={"sider.bg"}>
          <DrawerCloseButton></DrawerCloseButton>
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <SidebarContent key={"SideBarContent"} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const SidebarContent = ({ ...rest }: BoxProps) => {
  return (
    <Box as={"nav"} {...rest}>
      <Accordion defaultIndex={[0]} allowMultiple borderStyle={"none"} borderWidth={0}>
        {mainSections.map((section, index) => (
          <AccordionItem border="none" key={section.label + "accordionItem" + index}>
            <h2>
              <AccordionButton
                key={section.label + "accordionButton" + index}
                _hover={{
                  background: "brand.primary",
                  color: "brandPalette.900",
                }}
              >
                <Box as="span" flex="1" textAlign="left">
                  {section.label}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} key={section.label + "accordionPanel" + index}>
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
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
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
      <Accordion
        defaultIndex={[0]}
        allowMultiple
        my="0px"
        borderStyle={"hidden"}
        key={section.path + "accordion"}
        width={"100%"}
        mx={"1"}
        borderWidth={0}
      >
        <AccordionItem key={section.path + "AccordionItemInner"} border="none">
          <h2>
            <AccordionButton
              key={section.path + "AccordionButtonInner"}
              _hover={{
                background: "brand.primary",
                color: "brandPalette.900",
              }}
            >
              <Box as="span" flex="1" textAlign="left">
                {section.label}
              </Box>
              <AccordionIcon mx={-3} />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} key={section.path + "AccordionPanelInner"}>
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
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  else return <></>;
};
