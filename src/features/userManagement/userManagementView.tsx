import { Badge, Box, Button, Flex, Heading, HStack, Input, SimpleGrid, Table, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { z } from "zod";

import { useAppDispatch } from "../../app/hooks";
import CenterSpinner from "../../components/centerSpinner";
import PaginationComponent from "../../components/chackraPaginationComponent/chackraTablePagination";
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

export interface Auth0UserData {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  user_id?: string;
  blocked?: boolean;
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

type SortField = "email" | "company" | "name" | "surname" | "expiryDate";
type SortDir = "asc" | "desc";

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

  // Client-side column filters (no extra API calls — filter within loaded results)
  const [filterEmail, setFilterEmail] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterName, setFilterName] = useState("");

  // Client-side sort
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
              ...(userData.blocked !== undefined ? { blocked: userData.blocked } : {}),
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

  const handleBlockStatusChange = (userId: string, blocked: boolean) => {
    setUsers(prev => prev.map(u => (u.user_id === userId ? { ...u, blocked } : u)));
  };

  const handleColumnSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIndicator = (field: SortField): string => {
    if (sortField !== field) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterEmail, filterCompany, filterName, sortField, sortDir]);

  // Initial fetch on component mount
  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  // All filtering + sorting happens client-side against the already-loaded users array.
  // This means sorting, filtering, and pagination never trigger additional API calls.
  //
  // Note on Auth0 Management API rate limits:
  //   GET /api/v2/users  — fetched once on load / on search; paginated in batches of 100 on the backend.
  //   PATCH /api/v2/users/{id} — one call per block/unblock action; Auth0 limits ~15 req/sec.
  //   Bulk block/unblock is NOT viable — Auth0 has no batch endpoint; individual actions only.
  const filteredSortedUsers = useMemo(() => {
    let result = users;

    if (filterEmail) {
      const lc = filterEmail.toLowerCase();
      result = result.filter(u => u.email?.toLowerCase().includes(lc));
    }
    if (filterCompany) {
      const lc = filterCompany.toLowerCase();
      result = result.filter(u => u.app_metadata?.company?.toLowerCase().includes(lc));
    }
    if (filterName) {
      const lc = filterName.toLowerCase();
      result = result.filter(u => {
        const fullName =
          `${u.user_metadata?.given_name ?? u.given_name ?? ""} ${u.user_metadata?.family_name ?? u.family_name ?? ""}`.toLowerCase();
        return fullName.includes(lc);
      });
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        let av = "";
        let bv = "";
        if (sortField === "email") {
          av = a.email ?? "";
          bv = b.email ?? "";
        } else if (sortField === "company") {
          av = a.app_metadata?.company ?? "";
          bv = b.app_metadata?.company ?? "";
        } else if (sortField === "name") {
          av = a.user_metadata?.given_name ?? a.given_name ?? "";
          bv = b.user_metadata?.given_name ?? b.given_name ?? "";
        } else if (sortField === "surname") {
          av = a.user_metadata?.family_name ?? a.family_name ?? "";
          bv = b.user_metadata?.family_name ?? b.family_name ?? "";
        } else if (sortField === "expiryDate") {
          av = String(a.app_metadata?.expiry_date ?? "");
          bv = String(b.app_metadata?.expiry_date ?? "");
        }
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    return result;
  }, [users, filterEmail, filterCompany, filterName, sortField, sortDir]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedUsers.slice(start, start + pageSize);
  }, [filteredSortedUsers, currentPage, pageSize]);

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

      {/* Server-side search — re-fetches from Auth0 by name/email */}
      <Box mb="4">
        <Text fontSize="sm" fontWeight="medium" mb="2">
          Search Users:
        </Text>
        <Flex justify="space-between" align="center" gap="2">
          <HStack gap="2">
            <Input
              
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

      {/* Client-side column filters — no API calls, filter within loaded results */}
      <SimpleGrid columns={3} gap="3" mb="3">
        <Box>
          <Text fontSize="xs" fontWeight="medium" mb="1" color="fg.muted">
            Filter by Email
          </Text>
          <HStack gap="1">
            <Input
              size="sm"
              value={filterEmail}
              onChange={e => {
                setFilterEmail(e.target.value);
              }}
            />
            {filterEmail && (
              <Button
                size="sm"
                variant="ghost"
                px="2"
                onClick={() => {
                  setFilterEmail("");
                }}
              >
                ×
              </Button>
            )}
          </HStack>
        </Box>
        <Box>
          <Text fontSize="xs" fontWeight="medium" mb="1" color="fg.muted">
            Filter by Company
          </Text>
          <HStack gap="1">
            <Input
              size="sm"
              value={filterCompany}
              onChange={e => {
                setFilterCompany(e.target.value);
              }}
            />
            {filterCompany && (
              <Button
                size="sm"
                variant="ghost"
                px="2"
                onClick={() => {
                  setFilterCompany("");
                }}
              >
                ×
              </Button>
            )}
          </HStack>
        </Box>
        <Box>
          <Text fontSize="xs" fontWeight="medium" mb="1" color="fg.muted">
            Filter by Name / Surname
          </Text>
          <HStack gap="1">
            <Input
              size="sm"
              value={filterName}
              onChange={e => {
                setFilterName(e.target.value);
              }}
            />
            {filterName && (
              <Button
                size="sm"
                variant="ghost"
                px="2"
                onClick={() => {
                  setFilterName("");
                }}
              >
                ×
              </Button>
            )}
          </HStack>
        </Box>
      </SimpleGrid>

      <Text fontSize="xs" color="fg.muted" mb="2">
        Showing {paginatedUsers.length} of {filteredSortedUsers.length} users
        {filteredSortedUsers.length !== users.length
          ? ` (filtered from ${users.length} total)`
          : ""}
      </Text>

      <Box>
        {error ? (
          <Text color="status.error">Error: {error}</Text>
        ) : (
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Phone</Table.ColumnHeader>
                  <Table.ColumnHeader
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => {
                      handleColumnSort("email");
                    }}
                    _hover={{ bg: "bg.muted" }}
                  >
                    User{sortIndicator("email")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => {
                      handleColumnSort("company");
                    }}
                    _hover={{ bg: "bg.muted" }}
                  >
                    Company{sortIndicator("company")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => {
                      handleColumnSort("name");
                    }}
                    _hover={{ bg: "bg.muted" }}
                  >
                    Name{sortIndicator("name")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => {
                      handleColumnSort("surname");
                    }}
                    _hover={{ bg: "bg.muted" }}
                  >
                    Surname{sortIndicator("surname")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  <Table.ColumnHeader
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => {
                      handleColumnSort("expiryDate");
                    }}
                    _hover={{ bg: "bg.muted" }}
                  >
                    Expiry Date{sortIndicator("expiryDate")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginatedUsers.map((user, index) => {
                  const expiryStatus = getUserExpiryStatus(user.app_metadata?.expiry_date);
                  const isBlocked = user.blocked === true;

                  return (
                    <Table.Row
                      key={user.user_id ?? index}
                      bg={
                        isBlocked
                          ? "red.subtle"
                          : expiryStatus.status === "expired"
                            ? "orange.subtle"
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
                      <Table.Cell>
                        {expiryStatus.status === "expired" ? (
                          <Badge colorPalette="orange" size="sm">Expired</Badge>
                        ) : isBlocked ? (
                          <Badge colorPalette="red" size="sm">Blocked (Auth0)</Badge>
                        ) : (
                          <Badge colorPalette="green" size="sm">Active</Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>

      {/* Pagination — client-side, zero extra API calls */}
      <PaginationComponent
        count={filteredSortedUsers.length}
        page={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={newSize => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        isLoading={isLoading}
      />

      {/* Edit Modal */}
      <UserEditModal
        open={showEditModal}
        onClose={handleEditModalClose}
        onConfirm={handleEditModalConfirm}
        userId={selectedUserId}
        onBlockStatusChange={handleBlockStatusChange}
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
