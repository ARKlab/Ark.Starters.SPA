import * as msal from "@azure/msal-browser";
import { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { Nullable } from "ts-toolbelt/out/Union/Nullable";

export enum StatusEnum {
  Initial = "Initial",
  Loading = "Loading",

  Succeeded = "Succeeded",
  Failed = "Failed",
}

6;
export enum LoginStatus {
  Logged = "Logged",
  NotLogged = "NotLogged",
  Error = "Error",
}

export enum AuthenticationSteps {
  NotStarted = "NotStarted",
  Init = "Init",
  InitComplete = "InitComplete",
  Login = "Login",
  LoginError = "LoginError",
  LoginComplete = "LoginComplete",
  HandlingRedirect = "HandlingRedirect",
  Logout = "Logout",
  LogoutComplete = "LogoutComplete",
  LogoutError = "LogoutError",
}

export type MSALConfig = {
  msalConfig: msal.Configuration;
  scopes: string[];
};

export type Auth0Config = {
  auth0Config: Auth0ClientOptions;
};

export type UserAccountInfo = {
  username: string;
  permissions: string[] | null;
  groups: string[] | null;
};
export type AuthStoreType = {
  userInfo: UserAccountInfo | null;
  token: string | null;
};
