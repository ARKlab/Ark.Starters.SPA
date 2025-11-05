/**
 * Example integration file showing how to add Artesian calls to existing code
 *
 * This file demonstrates the integration points where you would add calls
 * to the Artesian API in your existing Groups Management flow.
 *
 * You can copy these patterns into your actual groupsManagementView.tsx
 * or wherever your user type management logic exists.
 */

import { Button } from "@chakra-ui/react";
import { useState } from "react";

import { artesianHooks } from "./artesianIntegration";
import type { UserTypeConfig } from "./artesianTypes";

// ===== EXAMPLE 1: User Type Creation =====
// Add this to your "Create User Type" button click handler
async function handleCreateUserType(groupName: string) {
  try {
    // Your existing local user type creation logic here
    console.log("Creating user type locally:", groupName);

    // Call Artesian API (non-blocking)
    await artesianHooks.onCreateUserType(groupName);

    // Continue with your existing UI updates
    console.log("User type created successfully");
  } catch (error) {
    console.error("Error creating user type:", error);
    // Your existing error handling
  }
}

// ===== EXAMPLE 2: User Type Configuration Update =====
// Add this to your "Save Configuration" button click handler
async function handleSaveConfiguration(groupId: string, groupName: string, configJson: string) {
  try {
    // Parse the config JSON
    const config: UserTypeConfig = JSON.parse(configJson);

    // Your existing local save logic here
    console.log("Saving configuration locally:", { groupId, groupName, config });

    // Call Artesian API (non-blocking)
    await artesianHooks.onUpdateUserType(groupName, parseInt(groupId, 10), config);

    // Continue with your existing UI updates
    console.log("Configuration saved successfully");
  } catch (error) {
    console.error("Error saving configuration:", error);
    // Your existing error handling
  }
}

// ===== EXAMPLE 3: Configuration-Only Changes =====
// Add this when only the JSON config changes (not group metadata)
async function handleConfigurationChange(groupId: string, configJson: string) {
  try {
    const config: UserTypeConfig = JSON.parse(configJson);

    // Your existing local update logic here
    console.log("Updating configuration locally:", { groupId, config });

    // Call Artesian API (non-blocking)
    await artesianHooks.onConfigChange(groupId, config);

    console.log("Configuration updated successfully");
  } catch (error) {
    console.error("Error updating configuration:", error);
  }
}

// ===== EXAMPLE 4: Integration in React Component =====
// Example of how to integrate into your existing React component

interface ExampleUserTypeManagerProps {
  // Your existing props
  onSuccess?: () => void;
}

export function ExampleUserTypeManager(_props: ExampleUserTypeManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [groupName] = useState("");
  const [configJson] = useState("{}");

  const handleCreateGroup = async () => {
    setIsLoading(true);
    try {
      // Your existing user type creation logic
      const newGroupId = await createUserTypeLocally(groupName);

      // Artesian integration (non-blocking)
      void artesianHooks.onCreateUserType(groupName);

      // Your existing UI updates
      console.log("Group created:", newGroupId);
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      // Your existing save logic
      await saveConfigurationLocally(configJson);

      // Artesian integration (non-blocking)
      const config = JSON.parse(configJson) as UserTypeConfig;
      void artesianHooks.onConfigChange("group-id", config);

      console.log("Configuration saved");
    } catch (error) {
      console.error("Failed to save configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Your existing UI */}
      <Button onClick={handleCreateGroup} loading={isLoading}>
        Create User Type
      </Button>
      <Button onClick={handleSaveConfig} loading={isLoading}>
        Save Configuration
      </Button>
    </div>
  );
}

// ===== Mock functions for example (replace with your actual implementations) =====
async function createUserTypeLocally(_groupName: string): Promise<string> {
  // Your actual user type creation logic
  await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async work
  return "new-group-id";
}

async function saveConfigurationLocally(configJson: string): Promise<void> {
  // Your actual configuration save logic
  await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async work
  console.log("Saving locally:", configJson);
}

// ===== CONFIGURATION SETUP =====
// Add these environment variables to your .env file or app configuration:
/*
REACT_APP_ARTESIAN_API_KEY=your_azure_function_code_here
REACT_APP_ARTESIAN_BASE_URL=https://your-artesian-function-app.azurewebsites.net
*/

export default {
  handleCreateUserType,
  handleSaveConfiguration,
  handleConfigurationChange,
  ExampleUserTypeManager,
};
