import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { constant, pipe } from "fp-ts/lib/function";
import { AccountInfo, AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import * as R from "ramda";
import { envType } from "../environment";

export function permissionSelector(token: any): string[] {
  return R.split(' ', token["extension_permissions"])
}



export function createAuthHelpers(auth: PublicClientApplication) {

  const getUserAccounts = () => auth.getAllAccounts();
  const getUserAccount = (): AccountInfo | null => auth.getActiveAccount();

  const loginWithRedirect = (scopes: string[]) => {
  return pipe(
    storePathname,
    T.apSecond(storeManagementToken),
    T.chain(() => buildScope({ scopes })),
    T.chain((options) => T.fromIO(() => auth.loginRedirect(options))),
    T.chain(() => T.never)
  )};

  const getTokenSilently = (scopes: string[], account: AccountInfo) =>
  pipe(
    () => { 
      return buildcopeAndAccount({ scopes, account});
    },
    TE.fromTask,
    TE.chain((options) =>
      TE.tryCatch<string, AuthenticationResult>(
        () => {  return auth.acquireTokenSilent(options)},
        (e: any) => { return e.error }
      )
    ),
    TE.orElse((error: string) =>
      error === "access_denied"
        ? TE.left("Can't acquire token")
        : pipe(
            () => { 
              return loginWithRedirect(scopes)()},
              (t) => TE.fromTask<AuthenticationResult, string>(t)
          )
    )
  );

  return {
    getTokenSilently,
    loginWithRedirect,
    getAccounts: getUserAccounts,
    getUserAccount
  };
}

export const clearManagementToken = T.fromIO<void>(() =>
  localStorage.removeItem("management-token")
);

export const getTokenFromUrl = TE.tryCatch(
  () =>
    window.location.search.includes("token")
      ? Promise.resolve(window.location.search.split("=")[1])
      : Promise.reject(),
  () => "token not found"
);

export const storeManagementToken = () => {
  if (window.location.search.includes("token"))
    localStorage.setItem(
      "management-token",
      window.location.search.split("=")[1]
    );

  return Promise.resolve();
};

export const getPathnameFromStorage = T.fromIO(() =>
  pipe(localStorage.getItem("pathName"), O.fromNullable)
);

export const storePathname = T.fromIO(() =>
  localStorage.setItem("pathName", window.location.pathname)
);

export const clearPathname = T.fromIO(() =>
  localStorage.removeItem("pathName")
);

function buildScope({
  scopes,
}: {
  scopes: string[];
}) {
  return T.fromIO(() => {
    return {
      scopes: scopes,
    }
  })  
}
function buildcopeAndAccount({
  scopes,
  account
}: {
  scopes: string[];
  account: AccountInfo
}) {
  return Promise.resolve(
      {
        scopes: scopes,
        account: account
      }
  );

}
