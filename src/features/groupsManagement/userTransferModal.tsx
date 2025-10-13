import { Box, Text, VStack, HStack, Badge, Button } from "@chakra-ui/react";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";

interface UserTransferModalProps {
  open: boolean;
  onClose: () => void;
  onTransfer: () => void;
  userName: string;
  existingGroupName: string;
  currentGroupName: string;
}

export const UserTransferModal = ({
  open,
  onClose,
  onTransfer,
  userName,
  existingGroupName,
  currentGroupName,
}: UserTransferModalProps) => {
  const modalBody = (
    <VStack align="stretch" gap="4">
      <Box>
        <Text fontSize="sm" color="gray.600" mb="4">
          The user <strong>{userName}</strong> is already assigned to another group.
        </Text>
        
        <VStack align="stretch" gap="3" p="4" bg="yellow.50" borderRadius="md">
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">Current assignment:</Text>
            <Badge colorPalette="orange" variant="solid">
              {existingGroupName}
            </Badge>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">Requested assignment:</Text>
            <Badge colorPalette="blue" variant="solid">
              {currentGroupName}
            </Badge>
          </HStack>
        </VStack>

        <Text fontSize="sm" color="gray.600" mt="4">
          Would you like to remove <strong>{userName}</strong> from <strong>{existingGroupName}</strong> and add them to <strong>{currentGroupName}</strong>?
        </Text>
      </Box>

      <HStack gap="3" justify="flex-end" mt="4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button colorPalette="red" onClick={onTransfer}>
          Transfer User
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <ChackraUIBaseModal
      open={open}
      onClose={onClose}
      title="User Already Assigned"
      body={modalBody}
      size="md"
    />
  );
};