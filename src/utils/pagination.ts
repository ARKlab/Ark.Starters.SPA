import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/TaskEither";

export const pagedDataDecoder = <C extends t.Mixed>(a: C) =>
  t.type({
    count: t.number,
    isCountPartial: t.boolean,
    skip: t.number,
    limit: t.number,
    data: t.array(a),
  });

export type PagedData<A> = Omit<
  t.TypeOf<ReturnType<typeof pagedDataDecoder>>,
  "data"
> & {
  data: A[];
};

export function getAllPages<E, A>(
  requester: (page: {
    skip: number;
    limit: number;
  }) => T.TaskEither<E, PagedData<A>>
): T.TaskEither<E, A[]> {
  function go(
    page: {
      skip: number;
      limit: number;
    },
    acc: A[]
  ): T.TaskEither<E, A[]> {
    return pipe(
      requester(page),
      T.chain((res) =>
        res.isCountPartial || res.skip + res.limit < res.count
          ? go(nextPage(page), acc.concat(res.data))
          : T.right(acc.concat(res.data))
      )
    );
  }
  return go({ skip: 0, limit: 200 }, []);
}

function nextPage(page: { skip: number; limit: number }) {
  return { ...page, skip: page.skip + page.limit };
}
