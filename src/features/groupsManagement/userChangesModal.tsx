import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";

interface User {
  Name: string;
  UserType: number;
}

interface UserChangesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  usersToAdd: string[];
  usersToRemove: string[];
  currentUsers: User[];
  selectedUserType: number | null;
  userTypeName: string;
}

export const UserChangesModal = ({
  open,
  onClose,
  onConfirm,
  usersToAdd,
  usersToRemove,
  currentUsers,
  selectedUserType,
  userTypeName,
}: UserChangesModalProps) => {
  const filteredCurrentUsers = selectedUserType 
    ? currentUsers.filter(user => user.UserType === selectedUserType)
    : [];

  const hasChanges = usersToAdd.length > 0 || usersToRemove.length > 0;

  const modalBody = (
    <VStack align="stretch" gap="4">
      <Box>
        <Text fontSize="sm" color="gray.600" mb="2">
          You are about to make the following changes to <strong>{userTypeName}</strong>:
        </Text>
      </Box>

      {usersToAdd.length > 0 && (
        <Box>
          <HStack mb="2">
            <Badge colorPalette="green" variant="solid">
              {usersToAdd.length}
            </Badge>
            <Text fontSize="sm" fontWeight="medium" color="green.600">
              Users to Add
            </Text>
          </HStack>
          <VStack align="stretch" gap="1" pl="4">
            {usersToAdd.map((userName, index) => (
              <Text key={index} fontSize="sm" color="green.700">
                + {userName}
              </Text>
            ))}
          </VStack>
        </Box>
      )}

      {usersToRemove.length > 0 && (
        <Box>
          <HStack mb="2">
            <Badge colorPalette="red" variant="solid">
              {usersToRemove.length}
            </Badge>
            <Text fontSize="sm" fontWeight="medium" color="red.600">
              Users to Remove
            </Text>
          </HStack>
          <VStack align="stretch" gap="1" pl="4">
            {usersToRemove.map((userName, index) => (
              <Text key={index} fontSize="sm" color="red.700">
                - {userName}
              </Text>
            ))}
          </VStack>
        </Box>
      )}

      {!hasChanges && (
        <Box p="4" textAlign="center">
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            No changes to apply
          </Text>
        </Box>
      )}

      {hasChanges && (
        <Box mt="2" p="3" bg="blue.50" borderRadius="md">
          <Text fontSize="xs" color="blue.700">
            <strong>Current group size:</strong> {filteredCurrentUsers.length} users
            <br />
            <strong>After changes:</strong> {Math.max(0, filteredCurrentUsers.length + usersToAdd.length - usersToRemove.length)} users
          </Text>
        </Box>
      )}
    </VStack>
  );

  return (
    <ChackraUIBaseModal
      open={open}
      onClose={onClose}
      onSubmit={hasChanges ? onConfirm : undefined}
      submitButton={hasChanges}
      footerCloseButton={true}
      submitButtonText={hasChanges ? "Apply Changes" : undefined}
      title="Confirm User Changes"
      body={modalBody}
      size="md"
    />
  );
};