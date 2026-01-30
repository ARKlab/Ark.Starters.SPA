export type EmptyObj = Record<PropertyKey, never>
export type MaybePromise<T> = T | PromiseLike<T>
export type Modify<T, R> = Omit<T, keyof R> & R
export type UnwrapPromise<T> = T extends PromiseLike<infer V> ? V : T
