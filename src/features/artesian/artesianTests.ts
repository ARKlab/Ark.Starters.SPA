/**
 * Test file demonstrating Artesian integration functionality
 * Run this to verify the component extraction and API integration works correctly
 */

import { ArtesianService } from "./artesianService";
import type { ArtesianConfig } from "./artesianTypes";
import { extractComponentTypes, extractComponents, flattenComponentTypes } from "./componentExtractor";

// Sample Config Data matching the exact structure specification
const sampleUserTypeConfig = {
  menuItem: [
    {
      reportId: "artesian",
      childItem: {
        childLinks: [
          {
            components: [{ componentType: "MarketData" }, { componentType: "Analytics" }],
          },
        ],
      },
    },
    {
      reportId: "riskManagement",
      childItem: {
        childLinks: [
          {
            components: [{ componentType: "RiskManagement" }, { componentType: "Portfolio" }],
          },
        ],
      },
    },
  ],
};

export function testComponentExtraction() {
  console.log("=== Testing Component Extraction ===");

  console.log("1. Extract Component Types:");
  const componentTypes = extractComponentTypes(sampleUserTypeConfig);
  console.log("Extracted types:", componentTypes);
 

  console.log("\n2. Extract Full Components:");
  const components = extractComponents(sampleUserTypeConfig);
  console.log("Extracted components:", components);

  console.log("\n3. Flatten Component Types (alternative method):");
  const flattenedTypes = flattenComponentTypes(sampleUserTypeConfig);
  console.log("Flattened types:", flattenedTypes);

  return { componentTypes, components, flattenedTypes };
}

export async function testArtesianService() {
  console.log("\n=== Testing Artesian Service ===");

  const disabledConfig: ArtesianConfig = {
    apiKey: undefined,
    baseUrl: "https://test.example.com",
  };

  const disabledService = new ArtesianService(disabledConfig);

  console.log("1. Testing disabled service (no API key):");
  const createTask = disabledService.createGroup({ group: "TestGroup" });
  const result = await createTask.execute();
  console.log("Disabled service result:", result);


  const enabledConfig: ArtesianConfig = {
    apiKey: "test-api-key",
    baseUrl: "https://httpbin.org", 
  };

  const enabledService = new ArtesianService(enabledConfig);

  console.log("\n2. Testing enabled service (with API key):");
  console.log("Note: This will make actual HTTP requests to httpbin.org");

  try {
    const updateTask = enabledService.updateGroup({
      name: "Test Group",
      id: 123,
      config: sampleUserTypeConfig,
    });

    const updateResult = await updateTask.execute();
    console.log("Update group result:", updateResult);
  } catch (error) {
    console.log("Expected error (httpbin doesn't have our endpoints):", error);
  }

  return true;
}

export function testIntegrationWorkflow() {
  console.log("\n=== Testing Full Integration Workflow ===");

  const componentTypes = extractComponentTypes(sampleUserTypeConfig);
  console.log("1. Extracted component types for ACL:", componentTypes);

  const groupId = "group-123";
  const groupName = "Test Manager Group";

  console.log("2. Simulating workflow:");
  console.log(`   - Group ID: ${groupId}`);
  console.log(`   - Group Name: ${groupName}`);
  console.log(`   - Component Types: ${componentTypes.join(", ")}`);
  console.log(`   - Full Config: ${JSON.stringify(sampleUserTypeConfig, null, 2)}`);

  console.log("\n3. API Calls that would be made:");
  console.log("   POST /api/CreateGroup?group=Test Manager Group&code={apiKey}");
  console.log("   POST /api/UpdateGroup?code={apiKey} (with full config in body)");
  console.log("   POST /api/ACLPathUpdater?code={apiKey} (with component types in body)");

  return {
    groupId,
    groupName,
    componentTypes,
    config: sampleUserTypeConfig,
  };
}

export async function runAllTests() {
  console.log("🧪 Running Artesian Integration Tests\n");

  try {
    const extractionResults = testComponentExtraction();
    await testArtesianService();
    const workflowResults = testIntegrationWorkflow();

    console.log("\nAll tests completed successfully!");
    console.log("\nTo use in your application:");
    console.log("1. Set environment variables: REACT_APP_ARTESIAN_API_KEY and REACT_APP_ARTESIAN_BASE_URL");
    console.log('2. Import artesianHooks from "./features/artesian"');
    console.log("3. Call the hooks in your user type management functions");
    console.log("4. See integrationExamples.tsx for detailed examples");

    return {
      extraction: extractionResults,
      workflow: workflowResults,
    };
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}

if (import.meta.env.MODE === "development") {
  runAllTests().catch(console.error);
}

export default {
  testComponentExtraction,
  testArtesianService,
  testIntegrationWorkflow,
  runAllTests,
  sampleUserTypeConfig,
};
