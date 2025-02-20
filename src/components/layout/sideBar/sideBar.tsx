//#region Imports
import { Box, useBreakpointValue, type BoxProps } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

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
      <SidebarContent display={{ base: "none", lg: "block" }} w={"13vw"} h={"full"} borderRight="1px" bg={"sider.bg"} />
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
  const defaultValue = mainSections[0].label + "accordionItem" + 0;

  return (
    <Box as={"nav"} {...rest}>
      <AccordionRoot borderStyle={"none"} borderWidth={0} collapsible multiple defaultValue={[defaultValue]}>
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
                  background: "bg.info",
                  color: "fg",
                }}
                paddingRight={2}
              >
                <Box as="span" flex="1" textAlign="left">
                  {section.label}
                </Box>
              </AccordionItemTrigger>
            </h2>

            <AccordionItemContent key={section.label + "accordionPanel" + index}>
              {section.subsections?.map((x, indexSub) => (
                <InnerMenuItems
                  key={x.path + "innerMenuItems" + indexSub}
                  section={x}
                  path={section.path ?? ""}
                  index={indexSub}
                />
              ))}
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

const InnerMenuItems = (props: { section: SubsectionMenuItemType; path: string; index: number }) => {
  const { section, path, index } = props;
  const parentPath = [path, section.path].join("/");
  const location = useLocation();
  const isActive = useMemo(() => location.pathname.startsWith(parentPath), [location, parentPath]);

  const key = section.path + "innerAccordionSections" + index;
  if (!section.isInMenu) return null;

  if (doINeedAnInnerAccordion(section)) {
    return <InnerAccordionSections key={key} section={section} parentPath={parentPath} />;
  }

  return (
    <Box
      key={section.path + "menuItemBox" + index}
      _hover={{
        background: isActive ? "brand.selected" : "bg.info",
        color: "brandPalette.900",
      }}
      background={isActive ? "brand.selected" : undefined}
      p={"0 1em"}
    >
      <MenuItem
        key={section.path + "menuItem" + index}
        path={parentPath}
        externalUrl={section.externalUrl}
        label={section.label}
        icon={section.icon}
      />
    </Box>
  );
};
