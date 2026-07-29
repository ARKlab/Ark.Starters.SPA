import { Badge, Box, Button, HStack, Input, Separator, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";

import { useGetUserInfoQuery } from "./userManagementApi";

interface UserEditData {
  azure_id?: string;
  created_at?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  nickname?: string;
  oid?: string;
  picture?: string;
  tenantid?: string;
  updated_at?: string;
  upn?: string;
  user_id?: string;
  last_ip?: string;
  last_login?: string;
  logins_count?: number;
  identity_api?: string;
  // Root-level fields for API payload
  phone_number?: string;
  company?: string;
  expiry_date?: string;
  artesian_expiry_date?: number;
  blocked?: boolean;
  identities?: {
    user_id: string;
    provider: string;
    connection: string;
    isSocial: boolean;
  }[];
  app_metadata?: {
    company?: string;
    expiry_date?: string;
    primary_user_id?: string;
  };
  user_metadata?: {
    country?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    phone_number?: string | null;
  };
}

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (userData: UserEditData) => void;
  userId: string | null;
  onBlockStatusChange?: (userId: string, blocked: boolean) => void;
}

export const UserEditModal = ({ open, onClose, onConfirm, userId, onBlockStatusChange: _onBlockStatusChange }: UserEditModalProps) => {
  const { data: userData, isLoading, error: apiError } = useGetUserInfoQuery(userId ?? "", { skip: !userId || !open });

  // Form fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Auth0 block status — tracks desired state; applied on save
  const [blockedState, setBlockedState] = useState<boolean | undefined>(undefined);
  const [originalBlockedState, setOriginalBlockedState] = useState<boolean | undefined>(undefined);

  // Populate form fields when user data is loaded
  useEffect(() => {
    if (!userData) return;

    // Populate form fields
    setName((userData as UserEditData).user_metadata?.given_name ?? (userData as UserEditData).given_name ?? "");
    setSurname((userData as UserEditData).user_metadata?.family_name ?? (userData as UserEditData).family_name ?? "");
    setPhone((userData as UserEditData).user_metadata?.phone_number ?? "");
    setCompany((userData as UserEditData).app_metadata?.company ?? "");
    const loadedBlocked = (userData as UserEditData).blocked ?? false;
    setBlockedState(loadedBlocked);
    setOriginalBlockedState(loadedBlocked);

    // Format expiry date for input field
    const expiryDateValue = (userData as UserEditData).app_metadata?.expiry_date;
    if (expiryDateValue) {
      // Convert to YYYY-MM-DD format for date input
      const date = new Date(expiryDateValue);
      if (!isNaN(date.getTime())) {
        setExpiryDate(date.toISOString().split("T")[0]);
      }
    } else {
      setExpiryDate("");
    }
  }, [userData]);

  const handleConfirm = () => {
    if (!userData) return;

    const typedData = userData as UserEditData;

    // Create full name from given_name and family_name
    const fullName = `${name} ${surname}`.trim();
    const formattedExpiryDate = expiryDate ? `${expiryDate}T00:00:00` : typedData.app_metadata?.expiry_date;

    // Calculate artesian_expiry_date as Unix timestamp in milliseconds
    const artesianExpiryDate = formattedExpiryDate ? new Date(formattedExpiryDate).getTime() : undefined;

    // Create payload with only the fields the API expects
    const updatePayload: UserEditData = {
      user_metadata: {
        phone_number: phone || "",
        name: fullName,
        given_name: name,
        family_name: surname,
      },
      app_metadata: {
        company: company,
        expiry_date: formattedExpiryDate,
      },
      artesian_expiry_date: artesianExpiryDate,
      // Only include blocked when it has been changed in this session
      ...(blockedState !== originalBlockedState ? { blocked: blockedState } : {}),
    };

    onConfirm(updatePayload);
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setSurname("");
    setPhone("");
    setCompany("");
    setExpiryDate("");
    setBlockedState(undefined);
    setOriginalBlockedState(undefined);
    onClose();
  };



  // Extract error message from RTK Query error
  const errorMessage = (() => {
    if (!apiError) return null;

    if ("status" in apiError) {
      if (apiError.status === "PROBLEM_DETAILS_ERROR") {
        return apiError.problemDetails.detail ?? apiError.problemDetails.title;
      }
      if (apiError.status === "ZOD_SCHEMA_ERROR") {
        return "Invalid response from server";
      }
      if (typeof apiError.status === "number") {
        return `Failed to fetch user details: ${apiError.status}`;
      }
    }

    if ("error" in apiError) {
      return apiError.error;
    }

    return "Failed to load user details";
  })();

  const typedUserData = userData as UserEditData | undefined;

  return (
    <ChackraUIBaseModal
      open={open}
      title={`Edit User - ${typedUserData?.email ?? "Loading..."}`}
      onClose={handleClose}
      onSubmit={handleConfirm}
      submitButton={true}
      submitButtonText="Apply changes"
      size="md"
      body={
        <VStack align="stretch" gap="4">
          {errorMessage && (
            <Box p="3" bg="error.subtle" borderRadius="md">
              <Text color="error.fg" fontSize="sm">
                {errorMessage}
              </Text>
            </Box>
          )}

          {isLoading ? (
            <Text color="status.subtle" textAlign="center" py="4">
              Loading user details...
            </Text>
          ) : (
            <>
              {/* Email (read-only) */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="1">
                  Email:
                </Text>
                <Input value={typedUserData?.email ?? ""} readOnly bg="bg.subtle" color="status.muted" />
              </Box>

              {/* Name */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="1">
                  Name:
                </Text>
                <Input
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                  placeholder="Enter first name"
                />
              </Box>

              {/* Surname */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="1">
                  Surname:
                </Text>
                <Input
                  value={surname}
                  onChange={e => {
                    setSurname(e.target.value);
                  }}
                  placeholder="Enter last name"
                />
              </Box>

              {/* Phone */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="1">
                  Phone:
                </Text>
                <Input
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                  }}
                  placeholder="Enter phone number"
                />
              </Box>

              {/* Company */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="1">
                  Company:
                </Text>
                <Input
                  value={company}
                  onChange={e => {
                    setCompany(e.target.value);
                  }}
                  placeholder="Enter company name"
                />
              </Box>

              {/* Expiry Date */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="1">
                  Expiry Date:
                </Text>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={e => {
                    setExpiryDate(e.target.value);
                  }}
                />
              </Box>

              <Separator />

              {/* Auth0 Block Status */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="2">
                  Auth0 Status:
                </Text>
                <HStack gap="3" align="center">
                  <Badge colorPalette={blockedState ? "red" : "green"} size="md">
                    {blockedState ? "Blocked" : "Active"}
                  </Badge>
                  <Button
                    size="sm"
                    colorPalette={blockedState ? "green" : "red"}
                    variant={blockedState ? "solid" : "outline"}
                    onClick={() => { setBlockedState(prev => !prev); }}
                  >
                    {blockedState ? "Unblock User" : "Block User"}
                  </Button>
                </HStack>
                {blockedState !== originalBlockedState && (
                  <Text fontSize="xs" color="fg.muted" fontStyle="italic" mt="2">
                    Change will be applied on save
                  </Text>
                )}
              </Box>
            </>
          )}
        </VStack>
      }
    />
  );
};
