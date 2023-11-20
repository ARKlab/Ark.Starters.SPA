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
  clientID: "",
  domain: "",
  scopes: "",
  knownAuthorities: "",
  signUpSignInPolicyId: "B2C_1_SignUpSignIn1",
  serviceUrl: "https://www.yourserviceurl.com", //CHANGE THIS WITH YOUR REAL SERVICE
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
