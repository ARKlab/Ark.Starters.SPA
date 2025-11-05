export interface ArtesianConfig {
  apiKey?: string;
  baseUrl: string;
  authCodes?: {
    CreateGroup?: string;
    UpdateGroup?: string;
    ACLPathUpdater?: string;
  };
}

export interface CreateGroupRequest {
  group: string;
}

export interface UpdateGroupRequest {
  name: string;
  id: number;
  config: UserTypeConfigStructure;
}

export interface ACLPathUpdateRequest {
  components: string[];
}

export interface UserTypeConfigStructure {
  menuItem: MenuItem[];
}

export interface MenuItem {
  reportId: string;
  childItem?: {
    childLinks: ChildLink[];
  };
}

export interface ChildLink {
  components: Component[];
}

export interface Component {
  componentType: string;
}

export type UserTypeConfig = Record<string, unknown> | string;

export interface ArtesianResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Task<T> {
  execute: () => Promise<Result<T>>;
}

export interface Result<T> {
  isSuccess: boolean;
  value?: T;
  error?: string;
}
