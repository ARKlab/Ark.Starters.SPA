import { ArtesianService } from "./artesianService";
import type { ArtesianConfig, UserTypeConfig, CreateGroupRequest, UpdateGroupRequest } from "./artesianTypes";
import { extractComponentTypes } from "./componentExtractor";

const defaultConfig: ArtesianConfig = {
  apiKey: import.meta.env.VITE_ARTESIAN_API_KEY ?? "testkey",
  baseUrl: import.meta.env.VITE_ARTESIAN_BASE_URL ?? "https://k4view-artesian-useradmin-test.azurewebsites.net/api/",
  authCodes: {
    CreateGroup: import.meta.env.VITE_ARTESIAN_CREATE_GROUP_CODE ?? undefined,
    UpdateGroup: import.meta.env.VITE_ARTESIAN_UPDATE_GROUP_CODE ?? undefined,
    ACLPathUpdater: import.meta.env.VITE_ARTESIAN_ACL_UPDATER_CODE ?? undefined,
  },
};

export const artesianService = new ArtesianService(defaultConfig);

export class ArtesianIntegration {
  private service: ArtesianService;

  constructor(service: ArtesianService = artesianService) {
    this.service = service;
  }

  async onUserTypeCreated(groupName: string): Promise<boolean> {
    const request: CreateGroupRequest = {
      group: groupName,
    };

    const task = this.service.createGroup(request);
    return this.service.executeWithFallback(task);
  }

  async onUserTypeUpdated(groupName: string, groupId: number, config: UserTypeConfig): Promise<boolean> {
    const componentTypes = extractComponentTypes(config);

    const updateGroupRequest: UpdateGroupRequest = {
      name: groupName,
      id: groupId,
      config: typeof config === "string" ? JSON.parse(config) : config,
    };

    return this.service.executeCompleteWorkflow(groupName, updateGroupRequest, componentTypes);
  }

  async onUserTypeConfigChanged(groupId: string, config: UserTypeConfig): Promise<boolean> {
    const componentTypes = extractComponentTypes(config);
    const task = this.service.updateACLPaths(groupId, componentTypes);
    return this.service.executeWithFallback(task);
  }
}

export const artesianIntegration = new ArtesianIntegration();

export const artesianHooks = {
  onCreateUserType: async (groupName: string) => artesianIntegration.onUserTypeCreated(groupName),

  onUpdateUserType: async (groupName: string, groupId: number, config: UserTypeConfig) =>
    artesianIntegration.onUserTypeUpdated(groupName, groupId, config),

  onConfigChange: async (groupId: string, config: UserTypeConfig) =>
    artesianIntegration.onUserTypeConfigChanged(groupId, config),
};

export default artesianIntegration;
