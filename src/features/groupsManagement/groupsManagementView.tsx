import { Box, Button, HStack, Heading, VStack, Text, Flex, Separator, Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

import { useAppDispatch } from "../../app/hooks";
import CenterSpinner from "../../components/centerSpinner";
import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";
import { Checkbox } from "../../components/ui/checkbox";
import { Login } from "../../lib/authentication/authenticationSlice";
import { useAuthContext } from "../../lib/authentication/components/useAuthContext";

import { UserChangesModal } from "./userChangesModal";
import { UserTransferModal } from "./userTransferModal";

interface UserType {
  ID: number;
  Name: string;
  Config: string;
}

interface User {
  Name: string;
  UserType: number;
}

interface Component {
  componentType: string;
  componentName: string;
  widId: string;
  reportCode: string;
  componentDescription: string;
}

interface ChildLink {
  childClass: string;
  link: string;
  label: string;
  reportId: string;
  reportTitle: string;
  reportCode: string;
  reportCategory: string;
  components: Component[];
}

interface MenuItem {
  link: string;
  class: string;
  menuSection: string;
  iconClass: string;
  label: string;
  childItem?: {
    childLinks: ChildLink[];
  };
}

interface AggregatedReportSettings {
  menuItem: MenuItem[];
}

// Simplified interfaces for API payload
interface SimpleComponent {
  componentType: string;
}

interface SimpleChildLink {
  reportId: string;
  components: SimpleComponent[];
}

interface SimpleMenuItem {
  class: string;
  childItem?: {
    childLinks: SimpleChildLink[];
  };
}

const GroupsManagementView = () => {
  const dispatch = useAppDispatch();
  const { context, isLogged } = useAuthContext();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [aggregatedReportSettings, setAggregatedReportSettings] = useState<AggregatedReportSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [usersToRemove, setUsersToRemove] = useState<Set<string>>(new Set());
  const [newUserName, setNewUserName] = useState("");
  const [usersToAdd, setUsersToAdd] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState<{
    userName: string;
    existingGroupId: number;
    existingGroupName: string;
    currentGroupName: string;
  } | null>(null);

  const handleLogin = () => {
    void dispatch(Login());
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await context.getToken();

        if (!token) {
          setError("No authentication token available");
          return;
        }

        // Fetch user types
        const userTypesResponse = await fetch("/userTypes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userTypesResponse.ok) {
          setError(`HTTP ${userTypesResponse.status}: ${userTypesResponse.statusText}`);
          return;
        }

        const userTypesData = (await userTypesResponse.json()) as UserType[];
        setUserTypes(userTypesData);

        // Fetch aggregated report settings
        const aggregatedResponse = await fetch(
          "https://k4view-portal-test-k2e.azurewebsites.net/pl/config/aggregatedReportSettings.json",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!aggregatedResponse.ok) {
          setError(`Failed to fetch aggregated report settings: ${aggregatedResponse.status}`);
          return;
        }

        const aggregatedData = (await aggregatedResponse.json()) as AggregatedReportSettings;
        setAggregatedReportSettings(aggregatedData);

        // Fetch users
        const usersResponse = await fetch("https://k4view-admin-test-k2e.azurewebsites.net/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          setError(`Failed to fetch users: ${usersResponse.status}`);
          return;
        }

        const usersData = (await usersResponse.json()) as User[];
        setUsers(usersData);

        // Auto-select first user type if available
        if (userTypesData.length > 0) {
          setSelectedUserType(userTypesData[0].ID);
        }
      } catch (err) {
        setError(`Request failed: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [context]);

  // Parse the Config JSON and update checked items when user type changes
  useEffect(() => {
    if (selectedUserType && userTypes.length > 0 && aggregatedReportSettings) {
      const userType = userTypes.find(ut => ut.ID === selectedUserType);
      if (userType?.Config) {
        try {
          const config = JSON.parse(userType.Config) as AggregatedReportSettings;
          const newCheckedItems: Record<string, boolean> = {};

          const enabledComponents = new Set<string>();
          config.menuItem.forEach((configMenuItem: MenuItem) => {
            if (configMenuItem.childItem?.childLinks) {
              configMenuItem.childItem.childLinks.forEach((configChildLink: ChildLink) => {
                configChildLink.components.forEach((configComponent: Component) => {
                  if (configComponent.componentType) {
                    enabledComponents.add(configComponent.componentType);
                  }
                });
              });
            }
          });

          aggregatedReportSettings.menuItem.forEach(aggregatedMenuItem => {
            if (!aggregatedMenuItem.childItem) {
              const configMenuItem = config.menuItem.find(
                (configItem: MenuItem) => configItem.class === aggregatedMenuItem.class,
              );
              newCheckedItems[aggregatedMenuItem.menuSection] = !!configMenuItem;
            } else {
              aggregatedMenuItem.childItem.childLinks.forEach(aggregatedChildLink => {
                aggregatedChildLink.components.forEach(aggregatedComponent => {
                  const isEnabled = enabledComponents.has(aggregatedComponent.componentType);
                  newCheckedItems[
                    `${aggregatedMenuItem.class}-${aggregatedChildLink.reportId}-${aggregatedComponent.widId}`
                  ] = isEnabled;
                });
              });
            }
          });

          setCheckedItems(newCheckedItems);
        } catch (err) {
          console.error("Failed to parse config:", err);
          setCheckedItems({});
        }
      } else {
        setCheckedItems({});
      }
    } else {
      setCheckedItems({});
    }
  }, [selectedUserType, userTypes, aggregatedReportSettings]);

  useEffect(() => {
    setUsersToAdd([]);
    setUsersToRemove(new Set());
    setIsRemoveMode(false);
    setNewUserName("");
  }, [selectedUserType]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked,
    }));
  };

  const handleRemoveToggle = () => {
    if (isRemoveMode) {
      setIsRemoveMode(false);
      setUsersToRemove(new Set());
      setUsersToAdd([]);
      setNewUserName("");
    } else {
      setIsRemoveMode(true);
    }
  };

  const handleUserRemoveToggle = (userName: string) => {
    setUsersToRemove(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userName)) {
        newSet.delete(userName);
      } else {
        newSet.add(userName);
      }
      return newSet;
    });
  };

  const handleAddUser = () => {
    const trimmedName = newUserName.trim();
    if (!trimmedName) return;

    // Check if user already exists in the current user type
    const existingUsers = selectedUserType 
      ? users.filter(user => user.UserType === selectedUserType).map(user => user.Name)
      : [];
    
    const isDuplicateInCurrentGroup = existingUsers.includes(trimmedName) || usersToAdd.includes(trimmedName);
    
    if (isDuplicateInCurrentGroup) {
      return;
    }

    // Check if user exists in other groups
    const existingGroupName = findUserInOtherGroups(trimmedName);
    if (existingGroupName) {
      // User exists in another group, show transfer modal
      const existingUser = users.find(user => user.Name === trimmedName && user.UserType !== selectedUserType);
      if (existingUser && selectedUserType) {
        const currentGroupName = userTypes.find(ut => ut.ID === selectedUserType)?.Name ?? "Current Group";
        setTransferData({
          userName: trimmedName,
          existingGroupId: existingUser.UserType,
          existingGroupName: existingGroupName,
          currentGroupName: currentGroupName
        });
        setShowTransferModal(true);
      }
      setNewUserName("");
      return;
    }

    setUsersToAdd(prev => [...prev, trimmedName]);
    setNewUserName("");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = async () => {
    if (!selectedUserType) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = await context.getToken();
      if (!token) {
        setError("No authentication token available");
        return;
      }

      const currentUsers = users
        .filter(user => user.UserType === selectedUserType)
        .map(user => user.Name);

      const finalUserList = [
        ...currentUsers.filter(userName => !usersToRemove.has(userName)), 
        ...usersToAdd 
      ];

      const selectedUserTypeData = userTypes.find(ut => ut.ID === selectedUserType);
      const groupName = selectedUserTypeData?.Name ?? "Unknown";

      const payload = {
        userType: selectedUserType,
        groupName: groupName,
        users: finalUserList
      };

      const response = await fetch("https://k4view-admin-test-k2e.azurewebsites.net/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const usersResponse = await fetch("https://k4view-admin-test-k2e.azurewebsites.net/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (usersResponse.ok) {
        const updatedUsers = (await usersResponse.json()) as User[];
        setUsers(updatedUsers);
      }

      setUsersToAdd([]);
      setUsersToRemove(new Set());
      setIsRemoveMode(false);
      setShowModal(false);

    } catch (err) {
      setError(`Failed to update users: ${String(err)}`);
      console.error("Error updating users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeUserFromAddList = (userName: string) => {
    setUsersToAdd(prev => prev.filter(user => user !== userName));
  };

  const findUserInOtherGroups = (userName: string): string | null => {
    for (const user of users) {
      if (user.Name === userName && user.UserType !== selectedUserType) {
        const userTypeData = userTypes.find(ut => ut.ID === user.UserType);
        return userTypeData?.Name ?? `Group ID ${user.UserType}`;
      }
    }
    return null;
  };

  const handleUserTransfer = async () => {
    if (!transferData || !selectedUserType) return;

    try {
      const token = await context.getToken();
      if (!token) return;

      const existingGroupUsers = users.filter(user => 
        user.UserType === transferData.existingGroupId && user.Name !== transferData.userName
      );
      
      const updateExistingGroupPayload = {
        userType: transferData.existingGroupId,
        groupName: transferData.existingGroupName,
        users: existingGroupUsers.map(user => user.Name)
      };

      const removeResponse = await fetch('/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateExistingGroupPayload),
      });

      if (!removeResponse.ok) {
        throw new Error('Failed to remove user from existing group');
      }

      const usersResponse = await fetch('/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (usersResponse.ok) {
        const userData = (await usersResponse.json()) as User[];
        setUsers(userData);
      }

      setUsersToAdd(prev => [...prev, transferData.userName]);
      
      setShowTransferModal(false);
      setTransferData(null);
      setNewUserName("");
      
    } catch (error) {
      console.error('Error transferring user:', error);
      setAlertMessage('Failed to transfer user. Please try again.');
      setShowAlertModal(true);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!selectedUserType || !aggregatedReportSettings) return;

    try {
      setIsSaving(true);
      setError(null);

      const token = await context.getToken();
      if (!token) {
        setError("No authentication token available");
        return;
      }

      const menuItems: SimpleMenuItem[] = [];

      aggregatedReportSettings.menuItem.forEach(aggregatedMenuItem => {
        const isLeafNode = !aggregatedMenuItem.childItem;

        if (isLeafNode) {
          const itemId = aggregatedMenuItem.menuSection;
          if (checkedItems[itemId]) {
            menuItems.push({
              class: aggregatedMenuItem.class,
            });
          }
        } else {
          const childLinks: SimpleChildLink[] = [];

          aggregatedMenuItem.childItem?.childLinks.forEach(aggregatedChildLink => {
            const selectedComponents: SimpleComponent[] = [];

            aggregatedChildLink.components.forEach(aggregatedComponent => {
              const componentId = `${aggregatedMenuItem.class}-${aggregatedChildLink.reportId}-${aggregatedComponent.widId}`;
              if (checkedItems[componentId]) {
                selectedComponents.push({
                  componentType: aggregatedComponent.componentType,
                });
              }
            });

            if (selectedComponents.length > 0) {
              childLinks.push({
                reportId: aggregatedChildLink.reportId,
                components: selectedComponents,
              });
            }
          });

          if (childLinks.length > 0) {
            menuItems.push({
              class: aggregatedMenuItem.class,
              childItem: {
                childLinks: childLinks,
              },
            });
          }
        }
      });

      const selectedUserTypeData = userTypes.find(ut => ut.ID === selectedUserType);
      const configObject = { menuItem: menuItems };

      const payload = {
        ID: selectedUserType,
        Name: selectedUserTypeData?.Name ?? "Unknown",
        Config: JSON.stringify(configObject),
      };

      const response = await fetch("https://k4view-admin-test-k2e.azurewebsites.net/userTypes/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const userTypesResponse = await fetch("/userTypes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (userTypesResponse.ok) {
        const updatedUserTypes = (await userTypesResponse.json()) as UserType[];
        setUserTypes(updatedUserTypes);
      }

    } catch (err) {
      setError(`Failed to save configuration: ${String(err)}`);
      console.error("Error saving configuration:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Show unauthenticated message if user is not logged in
  if (!isLogged) {
    return (
      <Flex direction="column" align="center" justifyContent="center" minH="96" gap="4">
        <Text fontSize="lg" color="gray.700" textAlign="center">
          Unauthenticated user, please log in
        </Text>
        <Button onClick={handleLogin} colorPalette="blue">
          Login
        </Button>
      </Flex>
    );
  }

  if (isLoading) {
    return <CenterSpinner />;
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justifyContent="center" minH="96" gap="4">
        <Text fontSize="lg" color="red.500" textAlign="center">
          Error initialising, please refresh
        </Text>
        <Button onClick={() => { window.location.reload(); }} colorPalette="blue">
          Refresh Page
        </Button>
      </Flex>
    );
  }

  return (
    <Box>
      <Box p="4">
        <Heading size="lg">Groups Management</Heading>
      </Box>

      <Flex>
        <Box p="4" minW="64">
          <VStack align="stretch" gap="0.5">
            {/* User Types List */}
            {userTypes.length > 0 && (
              <VStack align="stretch" gap="0.5">
                {userTypes.map(userType => (
                  <Button
                    key={userType.ID}
                    variant={selectedUserType === userType.ID ? "solid" : "ghost"}
                    p="2"
                    borderRadius="md"
                    justifyContent="flex-start"
                    onClick={() => {
                      setSelectedUserType(userType.ID);
                    }}
                  >
                    <Text fontSize="sm" fontWeight={selectedUserType === userType.ID ? "semibold" : "normal"}>
                      {userType.Name}
                    </Text>
                  </Button>
                ))}
              </VStack>
            )}

            <Button variant="outline" justifyContent="flex-start" p="1" size="sm" alignSelf="flex-start">
              <Text fontSize="sm">Create User Type</Text>
            </Button>
          </VStack>
        </Box>

        <Box flex="1" p="6">
          <Box p="6" borderRadius="md">
            <Heading size="md" mb="4">
              {selectedUserType && userTypes.length > 0
                ? `Config: ${userTypes.find(ut => ut.ID === selectedUserType)?.Name ?? "Unknown"}`
                : "Config: Select a user type"}
            </Heading>
            <VStack align="stretch" gap="4">
              {selectedUserType && userTypes.length > 0 && aggregatedReportSettings ? (
                <Box>
                  <VStack align="stretch" gap="1">
                    {aggregatedReportSettings.menuItem.map((menuItem, _menuIndex) => {
                      const isLeafNode = !menuItem.childItem;

                      if (isLeafNode) {
                        const itemId = menuItem.menuSection;
                        return (
                          <Box key={menuItem.menuSection} pl="1">
                            <Checkbox
                              checked={checkedItems[itemId] || false}
                              onCheckedChange={details => {
                                handleCheckboxChange(itemId, Boolean(details.checked));
                              }}
                            >
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
                              {menuItem.childItem.childLinks.map((childLink, _childIndex) => (
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
                                        {childLink.components.map((component, _componentIndex) => {
                                          const componentId = `${menuItem.class}-${childLink.reportId}-${component.widId}`;
                                          return (
                                            <Checkbox
                                              key={component.widId}
                                              checked={checkedItems[componentId] || false}
                                              onCheckedChange={details => {
                                                handleCheckboxChange(componentId, Boolean(details.checked));
                                              }}
                                            >
                                              <Text fontSize="xs">{component.componentName}</Text>
                                            </Checkbox>
                                          );
                                        })}
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
              ) : (
                <Box>
                  <Text fontSize="sm" color="gray.500" textAlign="center" py="8">
                    {!aggregatedReportSettings
                      ? "Loading menu structure..."
                      : "Select a user type from the left panel to configure its settings."}
                  </Text>
                </Box>
              )}

              <Box>
                <Button 
                  variant="outline" 
                  justifyContent="flex-start" 
                  p="1" 
                  size="sm" 
                  alignSelf="flex-start"
                  onClick={handleSaveConfiguration}
                  disabled={!selectedUserType || isLoading}
                >
                  <Text fontSize="sm">
                    {isSaving ? "Saving..." : "Save Configuration"}
                  </Text>
                </Button>
              </Box>
            </VStack>
          </Box>
        </Box>

        <Box p="4" style={{ width: '400px' }}>
          <Box p="4" borderRadius="md">
            <Flex justify="space-between" align="center" mb="4">
              <Heading size="md">
                {selectedUserType && userTypes.length > 0
                  ? `User List: ${userTypes.find(ut => ut.ID === selectedUserType)?.Name ?? "Unknown"}`
                  : "User List: Select a user type"}
              </Heading>
            </Flex>
            <VStack align="stretch" gap="4">
              <Box>
                <Text fontSize="sm" mb="2">
                  Add User:
                </Text>
                <HStack>
                  <Input 
                    placeholder="Enter username" 
                    size="sm" 
                    value={newUserName}
                    onChange={(e) => { setNewUserName(e.target.value); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddUser();
                      }
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={handleAddUser}>
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
                  {/* Existing users */}
                  {selectedUserType && users.length > 0 ? (
                    users
                      .filter(user => user.UserType === selectedUserType)
                      .map((user, index) => (
                        <HStack key={`existing-${index}`} justify="space-between" minH="6">
                          <Text 
                            fontSize="sm" 
                            color={usersToRemove.has(user.Name) ? "red.500" : "gray.600"}
                            textDecoration={usersToRemove.has(user.Name) ? "line-through" : "none"}
                          >
                            {user.Name}
                          </Text>
                          {isRemoveMode && (
                            <Button 
                              variant="outline" 
                              size="2xs" 
                              colorScheme="red"
                              onClick={() => { handleUserRemoveToggle(user.Name); }}
                            >
                              {usersToRemove.has(user.Name) ? "Undo" : "Remove"}
                            </Button>
                          )}
                        </HStack>
                      ))
                  ) : selectedUserType && users.length === 0 ? (
                    <Text fontSize="sm" color="gray.400" fontStyle="italic">
                      No users in this group
                    </Text>
                  ) : !selectedUserType ? (
                    <Text fontSize="sm" color="gray.400" fontStyle="italic">
                      Select a user type to view users
                    </Text>
                  ) : null}
                  
                  {/* Newly added users */}
                  {usersToAdd.map((userName, index) => (
                    <HStack key={`new-${index}`} justify="space-between" minH="8">
                      <Text 
                        fontSize="sm" 
                        color="green.600"
                        fontWeight="medium"
                      >
                        + {userName}
                      </Text>
                      <Button 
                        variant="outline" 
                        size="2xs" 
                        colorScheme="red"
                        onClick={() => {
                          removeUserFromAddList(userName);
                        }}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              <Separator />

              <Box>
                <HStack gap="2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleRemoveToggle}
                  >
                    {isRemoveMode ? "Cancel" : "Remove"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleShowModal}
                    disabled={usersToAdd.length === 0 && usersToRemove.size === 0}
                  >
                    Save Users
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Flex>

      <UserChangesModal
        open={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        usersToAdd={usersToAdd}
        usersToRemove={Array.from(usersToRemove)}
        currentUsers={users}
        selectedUserType={selectedUserType}
        userTypeName={selectedUserType ? userTypes.find(ut => ut.ID === selectedUserType)?.Name ?? "Unknown" : ""}
      />

      {/* Transfer Modal for moving users between groups */}
      {transferData && (
        <UserTransferModal
          open={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setTransferData(null);
          }}
          onTransfer={handleUserTransfer}
          userName={transferData.userName}
          existingGroupName={transferData.existingGroupName}
          currentGroupName={transferData.currentGroupName}
        />
      )}

      {/* Alert Modal for user already in another group */}
      <ChackraUIBaseModal
        open={showAlertModal}
        onClose={() => { setShowAlertModal(false); }}
        footerCloseButton={true}
        title="User Already Exists"
        body={
          <Text fontSize="sm" color="gray.600">
            {alertMessage}
          </Text>
        }
        size="md"
      />
    </Box>
  );
};

export default GroupsManagementView;
