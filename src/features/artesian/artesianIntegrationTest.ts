import { hasArtesianAccess, isArtesianConfigured, logArtesianStatus } from "./artesianDetection";
import { artesianHooks } from "./artesianIntegration";
import { flatComponentList } from "./componentExtractor";
const sampleArtesianUserTypeConfig = {
  reportId: "artesian",
  menuItem: [
    {
      class: "MasterFiles",
      childItem: {
        childLinks: [
          {
            reportId: "customers",
            components: [{ componentType: "CustomerList" }, { componentType: "CustomerDetails" }],
          },
          {
            reportId: "suppliers",
            components: [{ componentType: "SupplierList" }],
          },
        ],
      },
    },
    {
      class: "Reports",
      childItem: {
        childLinks: [
          {
            reportId: "artesian",
            components: [{ componentType: "ArtesianDashboard" }, { componentType: "ArtesianReports" }],
          },
        ],
      },
    },
  ],
};

// Sample user type config without Artesian access
const sampleRegularUserTypeConfig = {
  reportId: "standard",
  menuItem: [
    {
      class: "MasterFiles",
      childItem: {
        childLinks: [
          {
            reportId: "customers",
            components: [{ componentType: "CustomerList" }],
          },
        ],
      },
    },
  ],
};

export const testArtesianIntegration = async () => {
  console.log("=== Testing Artesian Integration ===");

  console.log("\n1. Testing Configuration Detection:");
  console.log("Artesian configured:", isArtesianConfigured());

  console.log("\n2. Testing Access Detection:");
  console.log("Artesian config has access:", hasArtesianAccess(sampleArtesianUserTypeConfig));
  console.log("Regular config has access:", hasArtesianAccess(sampleRegularUserTypeConfig));

  console.log("\n3. Testing Component Extraction:");
  const artesianComponents = flatComponentList(sampleArtesianUserTypeConfig);
  const regularComponents = flatComponentList(sampleRegularUserTypeConfig);
  console.log("Artesian config components:", artesianComponents);
  console.log("Regular config components:", regularComponents);

  console.log("\n4. Testing Integration Hooks:");

  if (isArtesianConfigured()) {
    try {
      console.log("Testing user type creation...");
      await artesianHooks.onCreateUserType("TestArtesianGroup");

      console.log("Testing user type update...");
      await artesianHooks.onUpdateUserType("TestArtesianGroup", 12345, JSON.stringify(sampleArtesianUserTypeConfig));

      console.log("Integration tests completed successfully");
    } catch (error) {
      console.log("Integration test failed (expected if not configured):", error);
    }
  } else {
    console.log("Artesian not configured - skipping integration tests");
  }

  console.log("\n5. Testing Status Logging:");
  logArtesianStatus("TestArtesianUser", sampleArtesianUserTypeConfig);
  logArtesianStatus("TestRegularUser", sampleRegularUserTypeConfig);

  console.log("\n=== Test Complete ===");
};

export const simulateGroupsManagementWorkflow = async () => {
  console.log("=== Simulating Groups Management Workflow ===");

  const newUserTypeName = "Manager";
  const newUserTypeConfig = JSON.stringify(sampleArtesianUserTypeConfig);

  console.log(`\n1. Creating user type: ${newUserTypeName}`);
  console.log("Config has Artesian access:", hasArtesianAccess(newUserTypeConfig));

  if (isArtesianConfigured() && hasArtesianAccess(newUserTypeConfig)) {
    try {
      console.log("Triggering Artesian createGroup...");
      await artesianHooks.onCreateUserType(newUserTypeName);
      console.log("Artesian createGroup completed");
    } catch (error) {
      console.log("Artesian createGroup failed:", error);
    }
  }

  console.log(`\n2. Updating user type configuration: ${newUserTypeName}`);

  if (isArtesianConfigured() && hasArtesianAccess(newUserTypeConfig)) {
    try {
      console.log("Triggering Artesian full workflow...");
      await artesianHooks.onUpdateUserType(newUserTypeName, 123, newUserTypeConfig);
      console.log("Artesian full workflow completed");
    } catch (error) {
      console.log("Artesian full workflow failed:", error);
    }
  }

  console.log("\n=== Simulation Complete ===");
};

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).testArtesianIntegration = testArtesianIntegration;
  (window as unknown as Record<string, unknown>).simulateGroupsManagementWorkflow = simulateGroupsManagementWorkflow;
  console.log("Artesian test functions available in console:");
  console.log("- testArtesianIntegration()");
  console.log("- simulateGroupsManagementWorkflow()");
}

export default {
  testArtesianIntegration,
  simulateGroupsManagementWorkflow,
};
