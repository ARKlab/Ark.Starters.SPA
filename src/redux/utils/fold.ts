export type FoldTag<A extends { tag: string }, B> = (
  val: A,
  options: { [k in A["tag"]]: (s: Extract<A, { tag: k }>) => B }
) => B;

export function foldTag<A extends { tag: string }, B>(
  val: A,
  options: {
    [k in A["tag"]]: (s: Extract<A, { tag: k }>) => B;
  }
): B {
  const tag: A["tag"] = val.tag;

  return options[tag](val as Extract<A, { tag: A["tag"] }>);
}

export function foldEnum<A extends string, B>(
  val: A,
  options: {
    [k in A]: (s: Extract<A, k>) => B;
  }
): B {
  return options[val](val);
}
