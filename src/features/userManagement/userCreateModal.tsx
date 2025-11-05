import { Input, VStack, Button, Flex, Text, Box } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";
import { Field } from "../../components/ui/field";
import { toaster } from "../../components/ui/toaster";
import { useAuthContext } from "../../lib/authentication/components/useAuthContext";

// Validation schema for Step 1 of user creation
const createUserStep1Schema = z.object({
  name: z.string().min(1, "This field is required"),
  surname: z.string().min(1, "This field is required"),
  company: z.string().min(1, "This field is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  expiryDate: z.string().min(1, "This field is required"),
  temporaryPassword: z.string().min(1, "This field is required"),
});

type CreateUserStep1Data = z.infer<typeof createUserStep1Schema>;

// API response types
interface UserCreationResponse {
  generatedEmail: string;
  displayName: string;
}

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onStep1Success: (userData: CreateUserStep1Data, response: UserCreationResponse) => void;
}

export const UserCreateModal = ({ open, onClose, onStep1Success }: UserCreateModalProps) => {
  const { context } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserStep1Data>({
    resolver: zodResolver(createUserStep1Schema),
    defaultValues: {
      name: "",
      surname: "",
      company: "",
      email: "",
      phone: "",
      expiryDate: "",
      temporaryPassword: "",
    },
  });

  const handleFormSubmit = async (data: CreateUserStep1Data) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const token = await context.getToken();
      if (!token) {
        setApiError("No authentication token available");
        return;
      }

      // Prepare form data in URL-encoded format
      const formData = new URLSearchParams();
      formData.append("userName", data.name);
      formData.append("userSurname", data.surname);
      formData.append("userCompany", data.company);
      formData.append("userEmail", data.email);
      formData.append("userPhone", data.phone ?? "");
      formData.append("userExpiryDate", data.expiryDate);
      formData.append("userPassword", data.temporaryPassword);

      const response = await fetch("https://k4view-admin-test-k2e.azurewebsites.net/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setApiError(errorText || `Request failed with status ${response.status}`);
        return;
      }

      const responseData = (await response.json()) as UserCreationResponse;

      // Success - proceed to step 2
      onStep1Success(data, responseData);
      reset(); // Clear form
      setApiError(null);

      toaster.create({
        title: "User created successfully",
        description: `Generated email: ${responseData.generatedEmail}`,
        type: "success",
      });
    } catch (error) {
      setApiError(`Network error: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset(); // Clear form when closing
    setApiError(null);
    onClose();
  };

  return (
    <ChackraUIBaseModal
      open={open}
      title="Create User - Step 1"
      onClose={handleClose}
      size="lg"
      body={
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack align="stretch" gap="4">
            {/* API Error Display */}
            {apiError && (
              <Box p="3" bg="error.subtle" borderRadius="md" borderColor="error.muted">
                <Text color="error.fg" fontSize="sm">
                  {apiError}
                </Text>
              </Box>
            )}

            {/* Name Field */}
            <Field label="Name" invalid={!!errors.name} errorText={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter first name" disabled={isSubmitting || isLoading} />
                )}
              />
            </Field>

            {/* Surname Field */}
            <Field label="Surname" invalid={!!errors.surname} errorText={errors.surname?.message}>
              <Controller
                name="surname"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter last name" disabled={isSubmitting || isLoading} />
                )}
              />
            </Field>

            {/* Company Field */}
            <Field label="Company" invalid={!!errors.company} errorText={errors.company?.message}>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter company name" disabled={isSubmitting || isLoading} />
                )}
              />
            </Field>

            {/* Email Field */}
            <Field label="Email" invalid={!!errors.email} errorText={errors.email?.message}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    disabled={isSubmitting || isLoading}
                  />
                )}
              />
            </Field>

            {/* Phone Field */}
            <Field label="Phone" invalid={!!errors.phone} errorText={errors.phone?.message}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter phone number" disabled={isSubmitting || isLoading} />
                )}
              />
            </Field>

            {/* Expiry Date Field */}
            <Field label="Expiry Date" invalid={!!errors.expiryDate} errorText={errors.expiryDate?.message}>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => <Input {...field} type="date" disabled={isSubmitting || isLoading} />}
              />
            </Field>

            {/* Temporary Password Field */}
            <Field
              label="Temporary Password"
              invalid={!!errors.temporaryPassword}
              errorText={errors.temporaryPassword?.message}
            >
              <Controller
                name="temporaryPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter temporary password"
                    maxLength={8}
                    disabled={isSubmitting || isLoading}
                  />
                )}
              />
            </Field>

            {/* Submit Button */}
            <Flex gap="3" justify="end" mt="4">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting || isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorPalette="primary"
                loading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Create User
              </Button>
            </Flex>
          </VStack>
        </form>
      }
    />
  );
};

// Export the types for use in parent components
export type { CreateUserStep1Data, UserCreationResponse };
