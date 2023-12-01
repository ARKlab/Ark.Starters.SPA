import { Option, none, some } from "fp-ts/lib/Option";
import { foldTag, FoldTag } from "./fold";

export type Async<E, A> =
  | { tag: "initial" }
  | { tag: "inProgress" }
  | { tag: "success"; data: A }
  | { tag: "error"; error: E };

export const initial = { tag: "initial" } as const;
export const inProgress = { tag: "inProgress" } as const;
export const success = <A>(x: A) => ({ tag: "success", data: x } as const);
export const error = <E>(x: E) => ({ tag: "error", error: x } as const);

export function fold<E, A, B>(
  val: Async<E, A>,
  options: Parameters<FoldTag<Async<E, A>, B>>[1]
) {
  return foldTag<Async<E, A>, B>(val, options);
}

export function map<A, B>(fn: (a: A) => B) {
  return <E>(request: Async<E, A>) => {
    switch (request.tag) {
      case "initial":
      case "inProgress":
      case "error":
        return request;
      case "success":
        return success(fn(request.data));
    }
  };
}

export function toOption<e, a>(request: Async<e, a>): Option<a> {
  return fold(request, {
    initial: () => none,
    inProgress: () => none,
    error: () => none,
    success: (a) => some(a.data),
  });
}

export function anyInProgess(requests: Async<any, any>[]): boolean {
  return requests.reduce(
    (acc: boolean, cur) => acc || isInProgress(cur),
    false
  );
}

export function isInProgress<E, A>(
  request: Async<E, A>
): request is Extract<Async<E, A>, { tag: "inProgress" }> {
  return request.tag === "inProgress";
}
export function isSuccess<E, A>(
  request: Async<E, A>
): request is Extract<Async<E, A>, { tag: "success" }> {
  return request.tag === "success";
}
