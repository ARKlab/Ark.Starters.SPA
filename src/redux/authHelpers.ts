import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import * as R from "ramda";

export function permissionSelector(token: any): string[] {
  return R.split(" ", token["extension_permissions"]);
}

export function createAuthHelpers(auth: PublicClientApplication) {
  const getUserAccounts = () => auth.getAllAccounts();
  const getUserAccount = (): AccountInfo | null => auth.getActiveAccount();

  const loginWithRedirect = async (scopes: string[]) => {
    storePathname();
    await storeManagementToken();
    const options = buildScope({ scopes });
    await auth.loginRedirect(options);
  };

  const getTokenSilently = async (scopes: string[], account: AccountInfo) => {
    try {
      const options = buildScopeAndAccount({ scopes, account });
      return await auth.acquireTokenSilent(options);
    } catch (error) {
      if (error === "access_denied") {
        throw new Error("Can't acquire token");
      } else {
        await loginWithRedirect(scopes);
      }
    }
  };

  return {
    getTokenSilently,
    loginWithRedirect,
    getAccounts: getUserAccounts,
    getUserAccount,
  };
}

export const clearManagementToken = () =>
  localStorage.removeItem("management-token");

export const getTokenFromUrl = () => {
  if (window.location.search.includes("token")) {
    return window.location.search.split("=")[1];
  } else {
    throw new Error("token not found");
  }
};

export const storeManagementToken = () => {
  if (window.location.search.includes("token")) {
    localStorage.setItem(
      "management-token",
      window.location.search.split("=")[1]
    );
  }
};

export const getPathnameFromStorage = () => localStorage.getItem("pathName");

export const storePathname = () =>
  localStorage.setItem("pathName", window.location.pathname);

export const clearPathname = () => localStorage.removeItem("pathName");

function buildScope({ scopes }: { scopes: string[] }) {
  return {
    scopes: scopes,
  };
}

function buildScopeAndAccount({
  scopes,
  account,
}: {
  scopes: string[];
  account: AccountInfo;
}) {
  return {
    scopes: scopes,
    account: account,
  };
}
