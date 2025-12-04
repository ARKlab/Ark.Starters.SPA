import { Box, Heading, Button, Flex, Text, Input, HStack, Table } from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { z } from "zod";

import { useAppDispatch } from "../../app/hooks";
import CenterSpinner from "../../components/centerSpinner";
import { API_URLS } from "../../config/apiUrls";
import { Login } from "../../lib/authentication/authenticationSlice";
import { useAuthContext } from "../../lib/authentication/components/useAuthContext";

import { MultiStepUserCreateModal } from "./multiStepUserCreateModal";
import { UserEditModal } from "./userEditModal";
import { getUserExpiryStatus } from "./userExpiryUtils";

export const UserTableDataSchema = z.object({
  Edit: z.string(),
  User: z.string(),
  Company: z.string(),
  Name: z.string(),
  Surname: z.string(),
  Phone: z.string(),
  "Expiry Date": z.string(),
});

export type UserTableDataType = z.infer<typeof UserTableDataSchema>;

interface Auth0UserData {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  user_id?: string;
  app_metadata?: {
    company?: string;
    expiry_date?: string | number;
    primary_user_id?: string;
    expiryDate?: string;
  };
  user_metadata?: {
    name?: string;
    given_name?: string;
    family_name?: string;
    phone_number?: string | null;
    country?: string;
  };
}

interface UserEditData {
  user_metadata?: {
    given_name?: string;
    family_name?: string;
    name?: string;
    phone_number?: string | null;
  };
  app_metadata?: {
    company?: string;
    expiry_date?: string;
  };
  artesian_expiry_date?: number;
}

const UserManagementView = () => {
  const dispatch = useAppDispatch();
  const { context, isLogged } = useAuthContext();

  const [users, setUsers] = useState<Auth0UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogin = () => {
    void dispatch(Login());
  };

  // Fetch users data
  const fetchUsers = useCallback(
    async (searchQuery?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await context.getToken();

        if (!token) {
          setError("No authentication token available");
          return;
        }

        const baseUrl = `${API_URLS.admin}/usersInfo`;
        const url = searchQuery ? `${baseUrl}?user=${encodeURIComponent(searchQuery)}` : baseUrl;

        const usersResponse = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          setError(`HTTP ${usersResponse.status}: ${usersResponse.statusText}`);
          return;
        }

        const usersData = (await usersResponse.json()) as Auth0UserData[];
        setUsers(usersData);
      } catch (err) {
        setError(`Request failed: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    },
    [context],
  );

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();
    void fetchUsers(trimmedSearch || undefined);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    void fetchUsers();
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedUserId(null);
  };

  const handleEditModalConfirm = async (userData: UserEditData) => {
    if (!selectedUserId) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = await context.getToken();
      if (!token) {
        setError("No authentication token available");
        return;
      }

      const updateResponse = await fetch(`${API_URLS.admin}/usersInfo/${encodeURIComponent(selectedUserId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!updateResponse.ok) {
        setError(`Failed to update user: ${updateResponse.status} ${updateResponse.statusText}`);
        return;
      }

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.user_id === selectedUserId) {
            return {
              ...user,
              user_metadata: {
                ...user.user_metadata,
                ...userData.user_metadata,
              },
              app_metadata: {
                ...user.app_metadata,
                ...userData.app_metadata,
              },
              given_name: userData.user_metadata?.given_name ?? user.given_name,
              family_name: userData.user_metadata?.family_name ?? user.family_name,
              name: userData.user_metadata?.name ?? user.name,
            };
          }
          return user;
        }),
      );

      setShowEditModal(false);
      setSelectedUserId(null);
    } catch (err) {
      setError(`Failed to update user: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalSubmit = () => {
    setIsLoading(true);
    setError(null);

    setShowCreateModal(false);
    void fetchUsers(searchTerm || undefined);

    setIsLoading(false);
  };

  // Initial fetch on component mount
  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  // Show unauthenticated message if user is not logged in
  if (!isLogged) {
    return (
      <Flex direction="column" align="center" justifyContent="center" minH="96" gap="4">
        <Text fontSize="lg" color="status.info" textAlign="center">
          Unauthenticated user, please log in
        </Text>
        <Button onClick={handleLogin} colorPalette="brand">
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
        <Text fontSize="lg" color="status.error" textAlign="center">
          Error loading users: {error}
        </Text>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          colorPalette="brand"
        >
          Refresh Page
        </Button>
      </Flex>
    );
  }

  return (
    <Box>
      <Heading mb="4">User Management</Heading>

      {/* Search Bar */}
      <Box mb="6">
        <Text fontSize="sm" fontWeight="medium" mb="2">
          Search Users:
        </Text>
        <Flex justify="space-between" align="center" gap="2">
          <HStack gap="2">
            <Input
              placeholder="Enter username to search..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              maxWidth="md"
            />
            <Button onClick={handleSearch} colorPalette="brand" disabled={isLoading}>
              Search
            </Button>
            {searchTerm && (
              <Button onClick={handleClearSearch} variant="outline" disabled={isLoading}>
                Clear
              </Button>
            )}
          </HStack>
          <Button
            colorPalette="brand"
            onClick={() => {
              setShowCreateModal(true);
            }}
          >
            Create User
          </Button>
        </Flex>
      </Box>

      <Box>
        {error ? (
          <Text color="status.error">Error: {error}</Text>
        ) : (
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Phone</Table.ColumnHeader>
                  <Table.ColumnHeader>User</Table.ColumnHeader>
                  <Table.ColumnHeader>Company</Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Surname</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  <Table.ColumnHeader>Expiry Date</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {users.map((user, index) => {
                  const expiryStatus = getUserExpiryStatus(user.app_metadata?.expiry_date);

                  return (
                    <Table.Row
                      key={user.user_id ?? index}
                      bg={
                        expiryStatus.status === "expired"
                          ? "red.subtle"
                          : expiryStatus.status === "expiring-soon"
                            ? "yellow.subtle"
                            : index % 2 === 0
                              ? "bg.subtle"
                              : undefined
                      }
                    >
                      <Table.Cell>{user.user_metadata?.phone_number ?? ""}</Table.Cell>
                      <Table.Cell>{user.email ?? ""}</Table.Cell>
                      <Table.Cell>{user.app_metadata?.company ?? ""}</Table.Cell>
                      <Table.Cell>{user.user_metadata?.given_name ?? user.given_name ?? ""}</Table.Cell>
                      <Table.Cell>{user.user_metadata?.family_name ?? user.family_name ?? ""}</Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleEditUser(user.user_id ?? "");
                          }}
                          disabled={!user.user_id}
                          _hover={{ bg: "gray.100" }}
                        >
                          <FaEdit />
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        {user.app_metadata?.expiry_date
                          ? typeof user.app_metadata.expiry_date === "string"
                            ? user.app_metadata.expiry_date.split("T")[0]
                            : String(user.app_metadata.expiry_date)
                          : "No expiry"}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>

      {/* Edit Modal */}
      <UserEditModal
        open={showEditModal}
        onClose={handleEditModalClose}
        onConfirm={handleEditModalConfirm}
        userId={selectedUserId}
      />

      {/* Create User Modal */}
      <MultiStepUserCreateModal
        open={showCreateModal}
        onClose={handleCreateModalClose}
        onComplete={handleCreateModalSubmit}
      />
    </Box>
  );
};

export default UserManagementView;
