import { EnvParams } from "../environment";
import { createAuthHelpers } from "./authHelpers";

import { PublicClientApplication } from "@azure/msal-browser";

export type Dependancies = {
  auth: PublicClientApplication;
  authHelpers: ReturnType<typeof createAuthHelpers>;
  env: EnvParams;
  history: any;
  //request: ReturnType<typeof createService>;
};
