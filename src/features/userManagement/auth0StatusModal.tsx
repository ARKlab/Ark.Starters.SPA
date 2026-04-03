import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiLock, FiUnlock } from "react-icons/fi";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";
import { API_URLS } from "../../config/apiUrls";
import { useAuthContext } from "../../lib/authentication/components/useAuthContext";

export interface Auth0StatusUser {
  user_id?: string;
  email?: string;
  blocked?: boolean;
}

interface Auth0StatusModalProps {
  open: boolean;
  onClose: () => void;
  user: Auth0StatusUser | null;
  onStatusChange: (userId: string, blocked: boolean) => void;
}

function getErrorMessage(status: number): string {
  if (status === 429)
    return "Auth0 rate limit reached. Please wait a moment before retrying.";
  if (status === 403)
    return "Insufficient permissions: the API key lacks the required 'update:users' scope.";
  return `Request failed with status ${status}.`;
}

export const Auth0StatusModal = ({ open, onClose, user, onStatusChange }: Auth0StatusModalProps) => {
  const { context } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (setBlocked: boolean) => {
    if (!user?.user_id) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = await context.getToken();
      let response: Response;

      if (!setBlocked) {
        // Unblock via dedicated PATCH route
        response = await fetch(
          `${API_URLS.admin}/usersInfo/${encodeURIComponent(user.user_id)}/unblock`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token ?? ""}` },
          },
        );
      } else {
        // Block via existing POST update route (blocked is not in the omit list in userUtils)
        response = await fetch(
          `${API_URLS.admin}/usersInfo/${encodeURIComponent(user.user_id)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token ?? ""}`,
            },
            body: JSON.stringify({ blocked: true }),
          },
        );
      }

      if (!response.ok) {
        setError(getErrorMessage(response.status));
        return;
      }

      onStatusChange(user.user_id, setBlocked);
      handleClose();
    } catch (err) {
      setError(`Request failed: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isBlocked = user?.blocked === true;

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const body = (
    <VStack align="stretch" gap="4">
      {error && (
        <Box p="3" bg="red.subtle" borderRadius="md">
          <Text color="red.fg" fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      <Box>
        <Text fontSize="sm" color="fg.muted" mb="1">
          Email
        </Text>
        <Text fontWeight="medium">{user?.email ?? "—"}</Text>
      </Box>

      <Box>
        <Text fontSize="sm" color="fg.muted" mb="2">
          Auth0 Status
        </Text>
        <Badge colorPalette={isBlocked ? "red" : "green"} size="md">
          {isBlocked ? "Blocked" : "Active"}
        </Badge>
      </Box>

      <HStack gap="3" pt="2">
        {isBlocked ? (
          <Button
            colorPalette="green"
            onClick={() => void handleAction(false)}
            disabled={isLoading}
            loading={isLoading}
            loadingText="Unblocking..."
          >
            <FiUnlock />
            Unblock User
          </Button>
        ) : (
          <Button
            colorPalette="red"
            variant="outline"
            onClick={() => void handleAction(true)}
            disabled={isLoading}
            loading={isLoading}
            loadingText="Blocking..."
          >
            <FiLock />
            Block User
          </Button>
        )}
      </HStack>
    </VStack>
  );

  return (
    <ChackraUIBaseModal
      open={open}
      title="Auth0 Account Status"
      onClose={handleClose}
      size="sm"
      body={body}
    />
  );
};
