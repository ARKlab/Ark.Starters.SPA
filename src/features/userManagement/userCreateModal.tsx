import { Input, VStack, Button, Flex, Text, Box } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { ChackraUIBaseModal } from "../../components/chackraModal/chackraBaseModal";
import { Field } from "../../components/ui/field";
import { toaster } from "../../components/ui/toaster";

import type { CreateUserRequest, UserCreationResponse } from "./userManagementApi";
import { useCreateUserMutation } from "./userManagementApi";

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

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onStep1Success: (userData: CreateUserStep1Data, response: UserCreationResponse) => void;
}

export const UserCreateModal = ({ open, onClose, onStep1Success }: UserCreateModalProps) => {
  const [createUser, { isLoading, error: apiError }] = useCreateUserMutation();

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
    try {
      const requestData: CreateUserRequest = {
        userName: data.name,
        userSurname: data.surname,
        userCompany: data.company,
        userEmail: data.email,
        userPhone: data.phone,
        userExpiryDate: data.expiryDate,
        userPassword: data.temporaryPassword,
      };

      const response = await createUser(requestData).unwrap();

      // Success - proceed to step 2
      onStep1Success(data, response);
      reset(); // Clear form

      toaster.create({
        title: "User created successfully",
        description: `Generated email: ${response.generatedEmail}`,
        type: "success",
      });
    } catch (error) {
      // Error is handled by RTK Query and available in apiError
      console.error("Failed to create user:", error);
    }
  };

  const handleClose = () => {
    reset(); // Clear form when closing
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
        return `Request failed with status ${apiError.status}`;
      }
    }

    if ("error" in apiError) {
      return apiError.error;
    }

    return "An unexpected error occurred";
  })();

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
            {errorMessage && (
              <Box p="3" bg="error.subtle" borderRadius="md" borderColor="error.muted">
                <Text color="error.fg" fontSize="sm">
                  {errorMessage}
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
