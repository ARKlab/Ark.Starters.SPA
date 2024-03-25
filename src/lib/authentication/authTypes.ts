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

export type UserAccountInfo = {
  username: string;
  permissions: string[] | null;
  groups: string[] | null;
};
export type AuthStoreType = {
  //To be implemented with needed infos about the user depending on the situation.
  userInfo: UserAccountInfo | null;
  token: string | null;
};
