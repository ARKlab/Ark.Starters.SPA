import type {
  ArtesianConfig,
  CreateGroupRequest,
  UpdateGroupRequest,
  ArtesianResponse,
  Task,
  Result,
} from "./artesianTypes";

class TaskImpl<T> implements Task<T> {
  constructor(private operation: () => Promise<T>) {}

  async execute(): Promise<Result<T>> {
    try {
      const value = await this.operation();
      return { isSuccess: true, value };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn("Artesian API call failed:", errorMessage);
      return { isSuccess: false, error: errorMessage };
    }
  }

  static of<T>(operation: () => Promise<T>): Task<T> {
    return new TaskImpl(operation);
  }
}

export class ArtesianService {
  private config: ArtesianConfig;

  constructor(config: ArtesianConfig) {
    this.config = config;
  }

  private isEnabled(): boolean {
    return Boolean(this.config.apiKey);
  }


  private getAuthCode(endpoint: "CreateGroup" | "UpdateGroup" | "ACLPathUpdater"): string {
    return this.config.authCodes?.[endpoint] ?? this.config.apiKey ?? "";
  }

  private async fetch<T>(
    endpoint: string,
    authCode: string,
    options: RequestInit = {},
    additionalParams: URLSearchParams = new URLSearchParams(),
  ): Promise<ArtesianResponse<T>> {
    if (!this.isEnabled()) {
      console.log("Artesian integration disabled - no API key provided");
      return { success: true }; 
    }

    try {
      const params = new URLSearchParams();
      params.append("code", authCode);

      additionalParams.forEach((value, key) => {
        params.append(key, value);
      });

      const url = `${this.config.baseUrl}${endpoint}?${params.toString()}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers ? (options.headers as Record<string, string>) : {}),
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Artesian API call to ${endpoint} failed:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  }
  createGroup(request: CreateGroupRequest): Task<ArtesianResponse> {
    return TaskImpl.of(async () => {
      const authCode = this.getAuthCode("CreateGroup");
      const params = new URLSearchParams();
      params.append("group", request.group);

      return this.fetch("CreateGroup", authCode, {}, params);
    });
  }

  updateGroup(request: UpdateGroupRequest): Task<ArtesianResponse> {
    return TaskImpl.of(async () => {
      const authCode = this.getAuthCode("UpdateGroup");
      return this.fetch("UpdateGroup", authCode, {
        body: JSON.stringify(request),
      });
    });
  }

  updateACLPaths(groupId: string, components: string[]): Task<ArtesianResponse> {
    return TaskImpl.of(async () => {
      const authCode = this.getAuthCode("ACLPathUpdater");
      return this.fetch("ACLPathUpdater", authCode, {
        body: JSON.stringify({ groupId, components }),
      });
    });
  }

  async executeCompleteWorkflow(
    groupName: string,
    groupData: UpdateGroupRequest,
    aclComponents: string[],
  ): Promise<boolean> {
    if (!this.isEnabled()) {
      console.log("Artesian integration disabled");
      return true; 
    }

    try {
      // Step 1: Create Group
      const createTask = this.createGroup({ group: groupName });
      const createResult = await createTask.execute();

      if (!createResult.isSuccess) {
        console.warn("CreateGroup failed, continuing anyway:", createResult.error);
        return true; 
      }

      // Step 2: Update Group
      const updateTask = this.updateGroup(groupData);
      const updateResult = await updateTask.execute();

      if (!updateResult.isSuccess) {
        console.warn("UpdateGroup failed, continuing anyway:", updateResult.error);
        return true; 
      }

      // Step 3: Update ACL Paths
      const aclTask = this.updateACLPaths(groupName, aclComponents);
      const aclResult = await aclTask.execute();

      if (!aclResult.isSuccess) {
        console.warn("ACLPathUpdater failed, continuing anyway:", aclResult.error);
        return true; 
      }

      console.log("Artesian workflow completed successfully");
      return true;
    } catch (error) {
      console.warn("Artesian workflow failed, continuing with local operation:", error);
      return true; 
    }
  }

  async executeWithFallback<T>(task: Task<T>): Promise<boolean> {
    const result = await task.execute();

    if (!result.isSuccess) {
      console.warn("Artesian operation failed, continuing with local operation:", result.error);
    }

    return true;
  }

  async executeAllWithFallback<T>(tasks: Task<T>[]): Promise<boolean> {
    if (!this.isEnabled()) {
      return true; 
    }

    try {
      await Promise.allSettled(tasks.map(async task => task.execute()));
    } catch (error) {
      console.warn("Artesian batch operation failed:", error);
    }

    return true;
  }
}
