//#region Imports
import {
  AccordionButton,
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Accordion,
  AccordionPanel,
  AccordionItem,
  AccordionIcon,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { mainSections } from "../../siteMap/mainSections";
import MenuItem from "./menuItem/menuItem";
import { MainSectionType, SubsectionMenuItemType } from "./menuItem/types";

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
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
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
      <Accordion defaultIndex={[0]} allowMultiple my="20px">
        {mainSections.map((section) => (
          <AccordionItem key={section.path}>
            <h2>
              <AccordionButton
                key={section.path}
                _hover={{ background: "brand.primary", color: "white" }}
              >
                <Box as="span" flex="1" textAlign="left">
                  {section.label}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} key={section.path}>
              {section.subsections.map((x) =>
                x.isInMenu ? (
                  x.hasSubsections ? (
                    <InnerAccordionSections section={x} />
                  ) : (
                    <MenuItem
                      key={x.path}
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
      <Accordion defaultIndex={[0]} allowMultiple my="0px" borderStyle={"none"}>
        <AccordionItem key={section.path}>
          <h2>
            <AccordionButton
              key={section.path}
              _hover={{ background: "brand.primary", color: "white" }}
            >
              <Box as="span" flex="1" textAlign="left">
                {section.label}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} key={section.path}>
            {section.subsections.map((x) =>
              x.isInMenu ? (
                <MenuItem
                  key={x.path}
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
