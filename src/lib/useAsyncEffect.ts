import { useEffect } from 'react';
import type { DependencyList } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

const isAsyncGenerator = (v: unknown): v is AsyncGenerator => {
  return Object.prototype.toString.call(v) === '[object AsyncGenerator]';
};

function useAsyncEffect(
  effect: () => Promise<void> | AsyncGenerator<void, void, void>,
  deps?: DependencyList
) {
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    const task = effect();
    let isCancelled = false;

    void (async () => {
        if (isAsyncGenerator(task)) {
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        for await (const _ of task) { 
          if (isCancelled) {
            break;
          }
        }
      } else {
        await task;
        }
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    })().then(r => { }, showBoundary);

    return () => {
      isCancelled = true;
      };
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, (deps ?? []).concat([showBoundary, effect]));
}
export default useAsyncEffect;