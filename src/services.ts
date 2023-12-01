import { createAuthHelpers } from "./redux/authHelpers";
import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";
import { ajax, AjaxResponse } from "rxjs/ajax";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { PathReporter } from "io-ts/es6/PathReporter";
import { pipe } from "fp-ts/lib/function";

export const createService = ({
  baseUrl,
  authHelpers,
  scopes,
}: {
  baseUrl: string;
  authHelpers: ReturnType<typeof createAuthHelpers>;
  scopes: string[];
}) => {
  let languageSelector = () => "";
  const makeRequest = <A>(
    decoder: t.Type<A>,
    fn: (token: string) => Rx.Observable<AjaxResponse>
  ) =>
    pipe(
      authHelpers.getTokenSilently(scopes, authHelpers.getUserAccount()!),
      TE.chain(
        (token) => () =>
          pipe(
            fn(token.accessToken)
              .pipe(
                RxOp.map((x) => x.response),
                RxOp.map(decoder.decode),
                RxOp.tap(
                  E.fold(
                    (e) => {
                      console.log(PathReporter.report(t.failures(e)));
                    },
                    () => {}
                  )
                ),
                RxOp.map(E.mapLeft(() => "parser error")),
                RxOp.catchError((e) => Rx.of(E.left<string, A>(e)))
              )
              .toPromise()
          )
      )
    );
  return {
    updateLanguage: (ipdatedlanguageSelector: () => string) => {
      languageSelector = ipdatedlanguageSelector;
    },
    get: <A>(url: string, decoder: t.Type<A>, headers?: t.Any) =>
      makeRequest(decoder, (token) =>
        ajax.get(`${baseUrl}/v1.0/${url}`, {
          ...headers,
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    delete: <A>(url: string, decoder: t.Type<A>, headers?: t.Any) =>
      makeRequest(decoder, (token) =>
        ajax.delete(`${baseUrl}/v1.0/${url}`, {
          ...headers,
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    getRaw: (url: string) =>
      pipe(
        authHelpers.getTokenSilently(scopes, authHelpers.getUserAccount()!),
        TE.chain((token) =>
          TE.tryCatch(
            () =>
              fetch(`${baseUrl}/v1.0/${url}`, {
                headers: {
                  authorization: `Bearer ${token.accessToken}`,
                  "Accept-Language": languageSelector(),
                },
              }).then((x) => x.blob()),
            (e) => e
          )
        )
      ),
    post: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.post(`${baseUrl}/v1.0/${url}`, body, {
          ...headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    postFile: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.post(`${baseUrl}/v1.0/${url}`, body, {
          ...headers,
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    put: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.put(`${baseUrl}/v1.0/${url}`, body, {
          ...headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    patch: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.patch(`${baseUrl}/v1.0/${url}`, body, {
          ...headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
  };
};
