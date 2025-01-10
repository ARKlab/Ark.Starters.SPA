// reason: https://stackoverflow.com/a/71017028
declare namespace React {
  function lazy<T extends ComponentType<unknown>>(factory: () => Promise<{ default: T }>): T;
}
