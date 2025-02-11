import type { BoxProps } from "@chakra-ui/react";
import { Box, AccordionRoot, AccordionItem, AccordionItemTrigger, AccordionItemContent, Stack } from "@chakra-ui/react";

import { mainSections } from "../../../siteMap/mainSections";

import MenuItem from "./menuItem/menuItem";
import type { SubsectionMenuItemType } from "./menuItem/types";

const SidebarContent = ({ ...rest }: BoxProps) => {
  return (
    <Box as={"nav"} {...rest}>
      <AccordionRoot multiple>
        {mainSections.map((section, index) => (
          <AccordionItem key={section.label + "accordionItem" + index} value={section.label}>
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                {section.label}
              </Box>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Stack gap={4} pl={4}>
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
              </Stack>
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
      <AccordionRoot multiple>
        <AccordionItem key={section.path + "AccordionItemInner"} value={section.label}>
          <AccordionItemTrigger>
            <Box flex="1" textAlign="left">
              {section.label}
            </Box>
          </AccordionItemTrigger>
          <AccordionItemContent>
            <Stack gap={4} pl={4}>
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
            </Stack>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    );
  else return null;
};

export default SidebarContent;
