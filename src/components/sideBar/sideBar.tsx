//#region Imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

import { mainSections } from "../../siteMap/mainSections";
import MenuItem from "./menuItem/menuItem";
import { SubsectionMenuItemType } from "./menuItem/types";
import { generateUniqueKey } from "../helper";

//#endregion

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} key={"SideBarContent"} />
        </DrawerContent>
      </Drawer>

      <MobileNav
        display={{ base: "flex", md: "none" }}
        onOpen={onOpen}
        marginTop={"50px"}
        marginBottom={"-60px"}
      />
    </>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="10" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Accordion
        defaultIndex={[0]}
        allowMultiple
        my="20px"
        borderStyle={"none"}
        borderWidth={0}
      >
        {mainSections.map((section, index) => (
          <AccordionItem
            border="none"
            key={section.path + "accordionItem" + index}
          >
            <h2>
              <AccordionButton
                key={section.path + "accordionButton" + index}
                _hover={{ background: "brand.primary", color: "white" }}
              >
                <Box as="span" flex="1" textAlign="left">
                  {section.label}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel
              pb={4}
              key={section.path + "accordionPanel" + index}
            >
              {section.subsections.map((x, indexSub) =>
                x.isInMenu ? (
                  x.hasSubsections ? (
                    <InnerAccordionSections
                      key={x.path + "innerAccordionSections" + indexSub}
                      section={x}
                    />
                  ) : (
                    <MenuItem
                      key={x.path + "menuItem" + indexSub}
                      component={x.component}
                      path={x.path}
                      label={x.label}
                      icon={x.icon}
                      isExternal={x.isExternal}
                    />
                  )
                ) : null
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

const InnerAccordionSections = (props: { section: SubsectionMenuItemType }) => {
  let section = props.section;
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
              _hover={{ background: "brand.primary", color: "white" }}
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
                  component={x.component}
                  path={x.path}
                  label={x.label}
                  icon={x.icon}
                  isExternal={x.isExternal}
                />
              ) : null
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  else return <></>;
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Menu
      </Text>
    </Flex>
  );
};
