import * as t from "io-ts";
import "io-ts/lib/PathReporter";
import { PathReporter } from "io-ts/lib/PathReporter";
import { of, Observable, throwError, zip } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, switchMap } from "rxjs/operators";
import { fold, left } from "fp-ts/lib/Either";

const envParams = t.type({
  clientID: t.string,
  domain: t.string,
  scopes: t.string,
  knownAuthorities: t.string,
  signUpSignInPolicyId: t.string,
  serviceUrl: t.string,
});

export type envType = t.TypeOf<typeof envParams>;

const staticConfig: Observable<t.TypeOf<typeof envParams>> = of({
  clientID: "4c426a3f-94bf-401c-b292-6b98de02412b",
  domain: "espertoenergiadev.onmicrosoft.com",
  scopes:
    "https://espertoenergiadev.onmicrosoft.com/eBilling.test.api/access_as_user",
  knownAuthorities: "https://espertoenergiadev.b2clogin.com",
  signUpSignInPolicyId: "B2C_1_SignUpSignIn1",
  serviceUrl:
    "https://test-ebilling-edm-service-5zymosn7np23s.azurewebsites.net", //this is only the edm service. in the future this could be renamed if more services will be added.
});

const connectionStringsConfig = zip(
  ajax.get("/connectionStrings.js").pipe(
    map((x: any) => x.response),
    map(envParams.decode),
    switchMap(
      fold(
        (a) => throwError(PathReporter.report(left(a))),
        (x) => of(x)
      )
    )
  )
).pipe(
  map(([connectionStrings]) => ({
    ...connectionStrings,
  }))
);

export const getEnv: Observable<t.TypeOf<typeof envParams>> =
  process.env.NODE_ENV === "development"
    ? staticConfig
    : connectionStringsConfig;
