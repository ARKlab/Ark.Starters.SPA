import { Box, Input, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";
import { useAuthContext } from "../../lib/authentication/components/useAuthContext";

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
}

export const UserEditModal = ({ open, onClose, onConfirm, userId }: UserEditModalProps) => {
  const { context } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserEditData>({});

  // Form fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Fetch user details when modal opens
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !open) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = await context.getToken();
        if (!token) {
          setError("No authentication token available");
          return;
        }

        const response = await fetch(
          `https://k4view-admin-test-k2e.azurewebsites.net/usersInfo/${encodeURIComponent(userId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          setError(`Failed to fetch user details: ${response.status}`);
          return;
        }

        const userDetails = (await response.json()) as UserEditData;
        setUserData(userDetails);

        // Populate form fields
        setName(userDetails.user_metadata?.given_name ?? userDetails.given_name ?? "");
        setSurname(userDetails.user_metadata?.family_name ?? userDetails.family_name ?? "");
        setPhone(userDetails.user_metadata?.phone_number ?? "");
        setCompany(userDetails.app_metadata?.company ?? "");

        // Format expiry date for input field
        const expiryDateValue = userDetails.app_metadata?.expiry_date;
        if (expiryDateValue) {
          // Convert to YYYY-MM-DD format for date input
          const date = new Date(expiryDateValue);
          if (!isNaN(date.getTime())) {
            setExpiryDate(date.toISOString().split("T")[0]);
          }
        } else {
          setExpiryDate("");
        }
      } catch (err) {
        setError(`Request failed: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserDetails();
  }, [userId, open, context]);

  const handleConfirm = () => {
    // Create full name from given_name and family_name
    const fullName = `${name} ${surname}`.trim();
    const formattedExpiryDate = expiryDate ? `${expiryDate}T00:00:00` : userData.app_metadata?.expiry_date;

    // Calculate artesian_expiry_date as Unix timestamp in milliseconds
    const artesianExpiryDate = formattedExpiryDate ? new Date(formattedExpiryDate).getTime() : undefined;

    // Create payload with only the fields the API expects
    const updatePayload = {
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
    setError(null);
    onClose();
  };

  return (
    <ChackraUIBaseModal
      open={open}
      title={`Edit User - ${userData.email ?? "Loading..."}`}
      onClose={handleClose}
      onSubmit={handleConfirm}
      submitButton={true}
      submitButtonText="Apply changes"
      size="md"
      body={
        <VStack align="stretch" gap="4">
          {error && (
            <Box p="3" bg="error.subtle" borderRadius="md">
              <Text color="error.fg" fontSize="sm">
                {error}
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
                <Input value={userData.email ?? ""} readOnly bg="bg.subtle" color="status.muted" />
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
            </>
          )}
        </VStack>
      }
    />
  );
};
