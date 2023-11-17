
import * as Rx from "rxjs";
import * as RxOp from "rxjs/operators";
import { ajax, AjaxResponse } from "rxjs/ajax";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/es6/PathReporter";
import { pipe } from "fp-ts/lib/function";

export const createServiceExt = ({
  baseUrl,
  token,
}: {
  baseUrl: string;
  token: string;
}) => {

  let languageSelector = () => "";

  const makeRequest = <A>(
    decoder: t.Type<A>,
    fn: (token: string) => Rx.Observable<AjaxResponse>
  ) =>
    pipe(
      () =>
        pipe(
          fn(token)
            .pipe(
              RxOp.map((x) => x.response),
              RxOp.map(decoder.decode),
              RxOp.tap(
                E.fold(
                  (e) => {
                    console.log(PathReporter.report(t.failures(e)));
                  },
                  () => { }
                )
              ),
              RxOp.map(E.mapLeft(() => "parser error")),
              RxOp.catchError((e) => Rx.of(E.left<string, A>(e)))
            )
            .toPromise()
        )
    );

  return {
    updateLanguage: (updatedlanguageSelector: () => string) => { languageSelector = updatedlanguageSelector },

    get: <A>(url: string, decoder: t.Type<A>, headers?: t.Any) =>
      makeRequest(decoder, (token) =>
        ajax.get(`${baseUrl}/${url}`, {
          ...headers,
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    delete: <A>(url: string, decoder: t.Type<A>, headers?: t.Any) =>
      makeRequest(decoder, (token) =>
        ajax.delete(`${baseUrl}/${url}`, {
          ...headers,
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    post: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.post(`${baseUrl}/${url}`, body, {
          ...headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    postFile: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.post(`${baseUrl}/${url}`, body, {
          ...headers,
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    put: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.put(`${baseUrl}/${url}`, body, {
          ...headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
    patch: <A, B>(url: string, body: A, decoder: t.Type<B>, headers = {}) =>
      makeRequest(decoder, (token) =>
        ajax.patch(`${baseUrl}/${url}`, body, {
          ...headers,
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "Accept-Language": languageSelector(),
        })
      ),
  };
};
