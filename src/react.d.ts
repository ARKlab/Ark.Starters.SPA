declare namespace React {
  function lazy<T extends ComponentType<unknown>>(factory: () => Promise<{ default: T }>): T;
}
