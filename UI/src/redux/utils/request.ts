import { Option, none, some } from "fp-ts/lib/Option";

export const notStarted = { tag: "notStarted" } as const;
export const inProgress = { tag: "inProgress" } as const;

type fail<a> = { tag: "fail"; value: a };
export const fail = <a>(a: a): fail<a> => ({ tag: "fail", value: a });

type success<a> = { tag: "success"; value: a };
export const success = <a>(a: a): success<a> => ({ tag: "success", value: a });

export type NetworkRequest<e, a> =
  | typeof notStarted
  | typeof inProgress
  | fail<e>
  | success<a>;

export function fold<e, a, o>(
  request: NetworkRequest<e, a>,
  cata: {
    notStarted: () => o;
    inProgress: () => o;
    fail: (e: e) => o;
    success: (a: a) => o;
  }
) {
  switch (request.tag) {
    case "notStarted":
      return cata.notStarted();
    case "inProgress":
      return cata.inProgress();
    case "fail":
      return cata.fail(request.value);
    case "success":
      return cata.success(request.value);
  }
}

export function map<e, a, b>(
  fn: (a: a) => b,
  request: NetworkRequest<e, a>
): NetworkRequest<e, b> {
  switch (request.tag) {
    case "notStarted":
    case "inProgress":
    case "fail":
      return request;
    case "success":
      return success(fn(request.value));
  }
}

export function toOption<e, a>(request: NetworkRequest<e, a>): Option<a> {
  return fold(request, {
    notStarted: () => none,
    inProgress: () => none,
    fail: (e: e) => none,
    success: (a: a) => some(a)
  });
}

export function anyInProgess(requests: NetworkRequest<any, any>[]): boolean {
  return requests.reduce(
    (acc: boolean, cur) => acc || isInProgress(cur),
    false
  );
}

export function isInProgress(request: NetworkRequest<any, any>) {
  return request.tag === "inProgress";
}
export function isSuccess(request: NetworkRequest<any, any>) {
  return request.tag === "success";
}
