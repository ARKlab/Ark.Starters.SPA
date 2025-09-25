import { Box, Button, HStack, Heading, VStack, Text, Flex, Separator, Input, Collapsible } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

import { Checkbox } from "../../components/ui/checkbox";

import fakeGroupManagementData from "./fakeGroupManagementData";

const GroupsManagementView = () => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <Box>
      <Box p="4">
        <Heading size="lg">{t("Groups Management")}</Heading>
      </Box>

      <Flex>
        <Box p="4" minW="64">
          <VStack align="stretch" gap="0.5">
            {/* Tree Items */}
            <VStack align="stretch" gap="0.5">
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm" fontWeight="medium">
                  UserType1
                </Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">UserType2</Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">UserType3</Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">TestType</Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">NO DOWNLOADS</Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">Unassigned Users</Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">Test Group</Text>
              </Button>
              <Button p="2" borderRadius="md" justifyContent="flex-start">
                <Text fontSize="sm">Admin Components</Text>
              </Button>
            </VStack>

            <Button variant="outline" justifyContent="flex-start" p="1" size="sm" alignSelf="flex-start">
              <Text fontSize="sm">Create User Type</Text>
            </Button>
          </VStack>
        </Box>

        <Box flex="1" p="6">
          <Box p="6" borderRadius="md">
            <Heading size="md" mb="4">
              Config: UserType1
            </Heading>
            <VStack align="stretch" gap="4">
              <Box>
                <VStack align="stretch" gap="1">
                  {fakeGroupManagementData.menuItem.map((menuItem, menuIndex) => {
                    const isLeafNode =
                      !menuItem.childItem ||
                      (menuItem.hasOwnProperty("components") && (menuItem as any).components.length === 0);

                    if (isLeafNode) {
                      return (
                        <Box key={menuItem.menuSection} pl="1">
                          <Checkbox>
                            <Text fontSize="xs">{menuItem.label}</Text>
                          </Checkbox>
                        </Box>
                      );
                    }

                    return (
                      <Box key={menuItem.menuSection}>
                        <Button
                          variant="plain"
                          colorPalette="brand"
                          justifyContent="flex-start"
                          p="1"
                          onClick={() => {
                            toggleSection(menuItem.menuSection);
                          }}
                        >
                          <HStack gap="1">
                            {expandedSections[menuItem.menuSection] ? <HiOutlineMinus /> : <HiOutlinePlus />}
                            <Text fontSize="xs">{menuItem.label}</Text>
                          </HStack>
                        </Button>

                        {expandedSections[menuItem.menuSection] && menuItem.childItem && (
                          <Box pl="4" pt="1">
                            {menuItem.childItem.childLinks.map((childLink, childIndex) => (
                              <Box key={childLink.reportId}>
                                <Button
                                  variant="plain"
                                  colorPalette="brand"
                                  justifyContent="flex-start"
                                  p="1"
                                  onClick={() => {
                                    toggleSection(childLink.reportId);
                                  }}
                                >
                                  <HStack gap="1">
                                    {expandedSections[childLink.reportId] ? <HiOutlineMinus /> : <HiOutlinePlus />}
                                    <Text fontSize="xs">{childLink.label}</Text>
                                  </HStack>
                                </Button>

                                {expandedSections[childLink.reportId] && (
                                  <Box pl="4" pt="1">
                                    <VStack align="stretch" gap="1">
                                      {childLink.components.map((component, componentIndex) => (
                                        <Checkbox key={component.widId}>
                                          <Text fontSize="xs">{component.componentName}</Text>
                                        </Checkbox>
                                      ))}
                                    </VStack>
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </VStack>
              </Box>

              <Box>
                <Button variant="outline" justifyContent="flex-start" p="1" size="sm" alignSelf="flex-start">
                  <Text fontSize="sm">Save Configuration</Text>
                </Button>
              </Box>
            </VStack>
          </Box>
        </Box>

        <Box p="4">
          <Box p="4" borderRadius="md">
            <Flex justify="space-between" align="center" mb="4">
              <Heading size="md">User List: UserType1</Heading>
            </Flex>
            <VStack align="stretch" gap="4">
              <Box>
                <Text fontSize="sm" mb="2">
                  Add User:
                </Text>
                <HStack>
                  <Input placeholder="Enter username" size="sm" />
                  <Button variant="outline" size="sm">
                    <Text fontSize="sm">Add</Text>
                  </Button>
                </HStack>
              </Box>

              <Separator />

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="2">
                  Users:
                </Text>
                <VStack align="stretch" gap="1">
                  <Text fontSize="sm" color="gray.600">
                    thomas.donlon@arkenergy.com
                  </Text>
                </VStack>
              </Box>

              <Separator />

              <Box>
                <HStack gap="2">
                  <Button size="sm" variant="outline">
                    Remove
                  </Button>
                  <Button size="sm" variant="outline">
                    Save Users
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default GroupsManagementView;
