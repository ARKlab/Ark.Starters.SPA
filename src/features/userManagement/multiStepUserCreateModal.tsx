import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";
import { toaster } from "../../components/ui/toaster";
import { API_URLS } from "../../config/apiUrls";
import { useAuthContext } from "../../lib/authentication/components/useAuthContext";
import GroupsManagementView from "../groupsManagement/groupsManagementView";

import { UserCreateModal } from "./userCreateModal";
import type { CreateUserStep1Data, UserCreationResponse } from "./userCreateModal";
import type { UserCredentialsData } from "./userCredentialsGenerator";
import { openPrintableCredentials, generateUserCredentialsHTML } from "./userCredentialsGenerator";
import { UserCredentialsPDF } from "./userCredentialsPDF";

// Multi-step user creation flow
export type CreateUserStep = 1 | 2 | 3;

interface MultiStepUserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const MultiStepUserCreateModal = ({ open, onClose, onComplete }: MultiStepUserCreateModalProps) => {
  const [currentStep, setCurrentStep] = useState<CreateUserStep>(1);
  const [createdUserResponse, setCreatedUserResponse] = useState<UserCreationResponse | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string>("");
  const { context } = useAuthContext();

  const handleStep1Success = (userData: CreateUserStep1Data, response: UserCreationResponse) => {
    setCreatedUserResponse(response);
    setTemporaryPassword(userData.temporaryPassword);
    setCurrentStep(2);
  };

  const handleStep2Confirm = () => {
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    setCurrentStep(1);
    setCreatedUserResponse(null);
    onComplete();
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCreatedUserResponse(null);
    onClose();
  };

  // Convert HTML to base64 PDF
  const convertHtmlToBase64Pdf = (htmlContent: string): string => {
    return btoa(encodeURIComponent(htmlContent));
  };

  const sendPdfViaEmail = async () => {
    if (!createdUserResponse) return;

    setIsSendingEmail(true);

    try {
      const token = await context.getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      const credentialsData = {
        displayName: createdUserResponse.displayName,
        generatedEmail: createdUserResponse.generatedEmail,
        tempPassword: temporaryPassword,
      };
      const htmlContent = generateUserCredentialsHTML(credentialsData);
      const pdfBase64 = convertHtmlToBase64Pdf(htmlContent);

      const response = await fetch(`${API_URLS.admin}/users/email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userEmail: createdUserResponse.generatedEmail,
          pdf: pdfBase64,
        }),
      });

      if (response.ok) {
        toaster.create({
          title: "Email Sent Successfully",
          description: `User credentials have been sent to ${createdUserResponse.generatedEmail}`,
          type: "success",
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending PDF email:", error);
      toaster.create({
        title: "Email Send Failed",
        description: "Failed to send user credentials via email. Please try again.",
        type: "error",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Step 1: Use the existing UserCreateModal
  if (currentStep === 1) {
    return <UserCreateModal open={open} onClose={handleClose} onStep1Success={handleStep1Success} />;
  }

  // Step 2: Groups Management containing Groups Management interface
  if (currentStep === 2) {
    return (
      <ChackraUIBaseModal
        open={open}
        title="Create User - Step 2: Assign Groups"
        onClose={handleClose}
        size="full"
        body={
          <Box px="4" pt="4" style={{ maxHeight: "80vh", paddingBottom: "0" }}>
            <Text mb="4" color="status.muted">
              User created: {createdUserResponse?.displayName} ({createdUserResponse?.generatedEmail})
            </Text>

            <Text mb="6" fontSize="lg" fontWeight="medium">
              Configure Groups and Permissions
            </Text>

            <Box style={{ height: "60vh" }} overflow="auto" mb="1">
              <GroupsManagementView />
            </Box>

            <Flex
              justify="center"
              pt="1"
              style={{ borderTop: "1px solid var(--chakra-colors-gray-200)", paddingBottom: "0", marginBottom: "0" }}
            >
              <Button colorPalette="brand" onClick={handleStep2Confirm}>
                Confirm Groups & Continue
              </Button>
            </Flex>
          </Box>
        }
      />
    );
  }

  // Step 3: PDF Generation and Email
  const credentialsData = {
    displayName: createdUserResponse?.displayName ?? "",
    generatedEmail: createdUserResponse?.generatedEmail ?? "", // Use generatedEmail from API response
    tempPassword: temporaryPassword,
  };

  const generateServerSidePdf = async (credentialsData: UserCredentialsData): Promise<Blob> => {
    const token = await context.getToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const htmlContent = generateUserCredentialsHTML(credentialsData);

    const response = await fetch(`${API_URLS.admin}/users/generatePdf`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        htmlContent: htmlContent,
        options: {
          format: "A4",
          margin: "1cm",
          printBackground: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Server PDF generation failed: ${response.status}`);
    }

    return response.blob();
  };

  const handlePrintCredentials = () => {
    openPrintableCredentials(credentialsData);
  };

  const handlePreviewCredentials = async () => {
    try {
      // Generate PDF using React PDF
      const pdfDocument = pdf(<UserCredentialsPDF user={credentialsData} />);
      const pdfBlob = await pdfDocument.toBlob();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 2000);
    } catch (error) {
      console.warn("React PDF failed (likely due to CSP), trying server-side PDF generation:", error);

      try {
        const serverPdfBlob = await generateServerSidePdf(credentialsData);
        const url = URL.createObjectURL(serverPdfBlob);
        window.open(url, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 2000);
        return;
      } catch (serverError) {
        console.warn("Server-side PDF generation also failed, falling back to HTML:", serverError);
      }

      // Fallback, HTML preview if both PDF methods fail
      try {
        const htmlContent = generateUserCredentialsHTML(credentialsData);
        const htmlBlob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(htmlBlob);

        const previewWindow = window.open(url, "_blank");
        if (previewWindow) {
          previewWindow.document.title = "User Credentials Preview";
        }

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 2000);
      } catch (fallbackError) {
        console.error("All preview methods failed:", fallbackError);
        toaster.create({
          title: "Preview Error",
          description: "Failed to generate PDF preview. Please try using the Print option instead.",
          type: "error",
        });
      }
    }
  };

  return (
    <ChackraUIBaseModal
      open={open}
      title="Create User - Step 3: User Details & Email"
      onClose={handleClose}
      size="lg"
      body={
        <Box p="4">
          <Text mb="4" color="status.muted">
            User: {createdUserResponse?.displayName} ({createdUserResponse?.generatedEmail})
          </Text>

          <Box p="6" bg="bg.subtle" borderRadius="md" mb="6">
            <Heading size="md" mb="4">
              User Credentials Document
            </Heading>
            <Text color="status.muted" mb="4">
              Generate a printable document with user credentials including:
            </Text>

            <Box pl="4" mb="6">
              <Text fontSize="sm" color="status.muted">
                • Display name and email address
                <br />
                • Temporary password for first login
                <br />
                • Professional formatting for printing
                <br />
              </Text>
            </Box>

            <Flex gap="3" flexWrap="wrap">
              <Button size="sm" variant="outline" onClick={handlePreviewCredentials}>
                Preview
              </Button>

              <Button size="sm" colorPalette="brand" onClick={handlePrintCredentials}>
                Print
              </Button>

              <Button
                size="sm"
                colorPalette="purple"
                onClick={sendPdfViaEmail}
                loading={isSendingEmail}
                disabled={isSendingEmail}
              >
                Send Email
              </Button>
            </Flex>
          </Box>

          <Flex gap="3" justify="end">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button colorPalette="primary" onClick={handleStep3Complete}>
              Complete User Creation
            </Button>
          </Flex>
        </Box>
      }
    />
  );
};
