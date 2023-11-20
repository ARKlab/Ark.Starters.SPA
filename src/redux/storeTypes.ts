import { envType } from "../environment";
import { createAuthHelpers } from "./authHelpers";
import { createService } from "../services";
import { PublicClientApplication } from "@azure/msal-browser";

export type Dependancies = {
  auth: PublicClientApplication;
  authHelpers: ReturnType<typeof createAuthHelpers>;
  env: envType;
  history: any;
  request: ReturnType<typeof createService>;
};
