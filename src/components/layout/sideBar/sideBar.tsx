//#region Imports
import { Box, type BoxProps } from "@chakra-ui/react"
import { useCallback, useEffect } from "react"
import { useLocation } from "react-router"

import type { ArkSubRoute } from "../../../lib/siteMapTypes"
import useRouteChanged from "../../../lib/useRouteChanged"
import { siteMap } from "../../../siteMap/siteMap"
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../../ui/accordion"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
} from "../../ui/drawer"
import { useLayoutContext } from "../useLayoutContext"

import MenuItem from "./menuItem/menuItem"

export default function SimpleSidebar() {
  const { isDesktop, isMobileSiderOpen, setMobileSiderOpen } = useLayoutContext()

  const closeDrawer = useCallback(() => {
    setMobileSiderOpen(false)
  }, [setMobileSiderOpen])

  // close drawer after clicking / navigating
  useRouteChanged(closeDrawer)

  // close drawer if screen gets bigger while drawer is open
  useEffect(() => {
    if (isDesktop) closeDrawer()
  }, [isDesktop, closeDrawer])

  if (isDesktop) return <SidebarContent h={"full"} borderRight="xs" bg={"bg.panel"} />
  else {
    return (
      <DrawerRoot
        open={isMobileSiderOpen}
        placement="end"
        onOpenChange={e => {
          setMobileSiderOpen(e.open)
        }}
      >
        <DrawerBackdrop />
        <DrawerContent bg="bg.panel">
          <DrawerCloseTrigger />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <SidebarContent key={"SideBarContent"} />
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    )
  }
}

const SidebarContent = ({ ...rest }: BoxProps) => {
  const defaultValue = siteMap[0].label + "accordionItem" + 0

  return (
    <Box as={"nav"} {...rest}>
      <AccordionRoot collapsible multiple defaultValue={[defaultValue]}>
        {siteMap.map((section, index) => (
          <AccordionItem value={section.label + "accordionItem" + index} key={section.label + "accordionItem" + index}>
            <h2>
              <AccordionItemTrigger
                borderRadius="none"
                key={section.label + "accordionButton" + index}
                _hover={{
                  background: "bg.info",
                  color: "fg",
                }}
                paddingRight={"2"}
              >
                <Box as="span" flex="1" textAlign="left" padding={"0.5"}>
                  {section.label}
                </Box>
              </AccordionItemTrigger>
            </h2>

            <AccordionItemContent key={section.label + "accordionPanel" + index}>
              {section.subsections?.map((x: ArkSubRoute, indexSub: number) => (
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
  )
}

function doINeedAnInnerAccordion(section: ArkSubRoute) {
  return section.subsections && section.subsections.length > 0 && section.subsections.filter(x => x.isInMenu).length > 0
}

const InnerAccordionSections = (props: { section: ArkSubRoute; parentPath: string }) => {
  const section = props.section
  if (section.subsections)
    return (
      <AccordionRoot collapsible multiple my="0" key={section.path + "accordion"} width={"full"} mx={"1"}>
        <AccordionItem value={section.path + "AccordionItemInner"} key={section.path + "AccordionItemInner"}>
          <h2>
            <AccordionItemTrigger
              borderRadius="none"
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
          <AccordionItemContent pb="4" key={section.path + "AccordionPanelInner"}>
            {section.subsections.map((x, index) =>
              x.isInMenu ? (
                <Box key={section.path + "menuItemBox" + index} px="4" py="0">
                  <MenuItem
                    key={x.path + "AccordionMenuItemInner"}
                    path={[props.parentPath, x.path].join("/")}
                    externalUrl={x.externalUrl}
                    label={x.label}
                    icon={x.icon}
                  />
                </Box>
              ) : null,
            )}
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    )
  else return <></>
}

const InnerMenuItems = (props: { section: ArkSubRoute; path: string; index: number }) => {
  const { section, path, index } = props
  const parentPath = [path, section.path].join("/")
  const location = useLocation()
  const isActive = location.pathname.startsWith(parentPath)

  const key = section.path + "innerAccordionSections" + index
  if (!section.isInMenu) return null

  if (doINeedAnInnerAccordion(section)) {
    return <InnerAccordionSections key={key} section={section} parentPath={parentPath} />
  }

  return (
    <Box
      key={section.path + "menuItemBox" + index}
      _hover={{
        background: isActive ? "brand.selected" : "bg.info",
        color: "brandPalette.900",
      }}
      background={isActive ? "brand.selected" : undefined}
      px="4"
      py="0"
    >
      <MenuItem
        key={section.path + "menuItem" + index}
        path={parentPath}
        externalUrl={section.externalUrl}
        label={section.label}
        icon={section.icon}
      />
    </Box>
  )
}
