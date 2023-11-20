import {
  ActionsObservable,
  StateObservable,
  ofType,
  combineEpics,
} from "redux-observable";
import { Dependancies } from "../storeTypes";
import { filter, map, switchMap, switchMapTo, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import IdTokenVerifier from "idtoken-verifier";
import { User } from "@auth0/auth0-spa-js";
import { clearPathname, getPathnameFromStorage } from "../authHelpers";
import { constant, flow, pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { AuthenticationResult } from "@azure/msal-browser";
import { includes, pathOr } from "ramda";

export const key = "auth";

const verifier = new IdTokenVerifier({});

type State =
  | { tag: "initial" }
  | { tag: "login-required" }
  | { tag: "login-failed"; error?: string }
  | { tag: "authenticated"; profile: any & { accessToken: any } };

export const initAction = { type: "INIT" } as const;
export const handleRedirectAction = {
  type: "management/authentication/HANDLE_REDIRECT",
} as const;
const checkSessionFailedAction = {
  type: "management/authentication/CHECK_SESSION_FAILED",
} as const;

export const authenticatedActionType =
  "management/authentication/AUTHENTICATED";
const authenticatedAction = (profile: any & { accessToken: any }) =>
  ({
    type: authenticatedActionType,
    profile,
  } as const);

export const loginAction = {
  type: "management/authentication/LOGIN",
} as const;

const loginFailedAction = (error?: string) =>
  ({
    type: "management/authentication/LOGIN_FAILED",
    error,
  } as const);

export const signupAction = {
  type: "management/authentication/SIGNUP",
} as const;

export const logoutAction = {
  type: "management/authentication/LOGOUT",
} as const;

type Action =
  | typeof initAction
  | typeof handleRedirectAction
  | typeof checkSessionFailedAction
  | ReturnType<typeof authenticatedAction | typeof loginFailedAction>;

export function reducer(
  state: State = { tag: "initial" },
  action: Action
): State {
  switch (action.type) {
    case initAction.type:
      return { tag: "initial" };
    case "management/authentication/CHECK_SESSION_FAILED":
      return { tag: "login-required" };
    case authenticatedActionType:
      return { tag: "authenticated", profile: action.profile };
    case "management/authentication/LOGIN_FAILED":
      return { tag: "login-failed", error: action.error };
    case handleRedirectAction.type:
    default:
      return state;
  }
}

const applyLoginCallback = (deps: Dependancies) => {
  return () => {
    let searchParams = new URLSearchParams(window.location.hash.substring(1));
    let dc = searchParams.get("error");

    if (dc === "access_denied")
      return new Promise(() => (window.location.href = window.location.origin));

    return deps.auth.handleRedirectPromise().then((x) => {
      let accounts = deps.auth.getAllAccounts();

      if (x) deps.auth.setActiveAccount(x.account);
      else if (accounts[0]) deps.auth.setActiveAccount(accounts[0]);
    });
  };
};

export function tenantClaim(user: any): O.Option<string> {
  return O.fromNullable("");
}
export const setTenantInStorage: (tenant: string) => T.Task<string> = (
  tenant: string
) =>
  T.fromIO(() =>
    pipe(localStorage.setItem("tenant", tenant), constant(tenant))
  );
const ensureUserAuthentication = (deps: Dependancies) =>
  pipe(
    deps.authHelpers.getTokenSilently(
      [deps.env.scopes],
      deps.authHelpers.getUserAccount()!
    ),
    TE.map((token: AuthenticationResult) => {
      return verifier.decode(token.accessToken).payload;
    }),
    TE.chain((accessToken) =>
      pipe(
        tenantClaim(accessToken),
        O.getOrElse(() => ""),
        setTenantInStorage,
        TE.fromTask,
        TE.chain((options) =>
          TE.tryCatch(
            () =>
              Promise.resolve(deps.authHelpers.getUserAccount()).then(
                (x) => x ?? Promise.reject("account info not found")
              ),
            (x) => x as string
          )
        ),
        TE.map(() => ({
          ...deps.authHelpers.getUserAccount()!,
          accessToken,
        }))
      )
    )
  );

export function initEpic(
  action$: ActionsObservable<any>,
  _: StateObservable<any>,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(initAction.type),
    filter(
      () =>
        !window.location.href.includes("Login") &&
        !window.location.href.includes("Logout") &&
        !window.location.href.includes("Signup") &&
        !window.location.href.includes("LoginError")
    ),
    switchMap(applyLoginCallback(deps)),
    switchMap(pipe(ensureUserAuthentication(deps))),
    map(E.fold(() => checkSessionFailedAction as Action, authenticatedAction))
  );
}
export function signupEpic(
  action$: ActionsObservable<any>,
  _: StateObservable<any>,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(signupAction.type),
    //switchMap(deps.authHelpers.signupWithRedirect([deps.env.scopes])),
    switchMapTo(EMPTY)
  );
}
function applyRedirects(deps: Dependancies) {
  const pushUrl = (url: string) => T.fromIO(() => deps.history.push(url));

  return pipe(
    getPathnameFromStorage,
    T.chain(O.fold(() => T.of({}), pushUrl)),
    T.chainFirst(() => clearPathname)
  );
}
export function checkSessionFailedEpic(
  action$: ActionsObservable<any>,
  _: StateObservable<any>,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(checkSessionFailedAction.type),
    switchMap(deps.authHelpers.loginWithRedirect([deps.env.scopes])),
    switchMapTo(EMPTY)
  );
}

export function loginEpic(
  action$: ActionsObservable<any>,
  _: StateObservable<any>,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(loginAction.type),
    switchMap(deps.authHelpers.loginWithRedirect([deps.env.scopes])),
    switchMapTo(EMPTY)
  );
}

export function logoutEpic(
  action$: ActionsObservable<any>,
  _: StateObservable<any>,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(logoutAction.type),
    tap(() => deps.auth.logoutRedirect()),
    switchMapTo(EMPTY)
  );
}
export const epic = combineEpics(
  initEpic,
  checkSessionFailedEpic,
  loginEpic,
  signupEpic,
  logoutEpic,
  loggedInEpic
);

const baseSelector = (state: any) => state[key] as State;

const userSelector = flow(
  baseSelector,
  O.fromPredicate(
    (x): x is Extract<State, { tag: "authenticated" }> =>
      x.tag === "authenticated"
  ),
  O.map((x) => x.profile)
);

export const Selectors = {
  auth: baseSelector,
  user: userSelector,
};

export function loggedInEpic(
  action$: ActionsObservable<any>,
  _: StateObservable<any>,
  deps: Dependancies
) {
  return action$.pipe(
    ofType(authenticatedActionType),
    map((x) => {
      return "";
    })
  );
}

// ***************** Add roles in hierarchical order *******************
export enum UserRolesType {
  admin = "Admin",
  customerCare = "CustomerCare",
  user = "User",
}
// ***************** Add roles in hierarchical order *******************

export const hasUserRole = (
  requiredRole: UserRolesType,
  userRole: UserRolesType
) => {
  let userRoleHierarchy = Object.values(UserRolesType);
  let validRoles = userRoleHierarchy.splice(
    0,
    userRoleHierarchy.findIndex((x) => x === requiredRole) + 1
  );
  return validRoles.includes(userRole);
};

const getUserRole = (user: User) => {
  if (
    includes(
      "grant:admin",
      pathOr([], ["accessToken", "extension_permissions"], user.profile)
    )
  )
    return UserRolesType.admin;
  else if (
    includes(
      "grant:customercare",
      pathOr([], ["accessToken", "extension_permissions"], user.profile)
    )
  )
    return UserRolesType.customerCare;
  else return UserRolesType.user;
};
