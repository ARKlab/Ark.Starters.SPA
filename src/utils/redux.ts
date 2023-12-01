export function wrapExhaustiveReducer<S, A>(
  reducer: (s: S, a: A) => S,
  s: S
): (s: any, a: any) => S {
  return (state, action) => reducer(state, action) || state || s;
}
