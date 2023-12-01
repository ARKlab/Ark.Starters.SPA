import { createStore, applyMiddleware, compose } from "redux";
import { BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { createEpicMiddleware } from "redux-observable";
import { rootReducer, rootEpic } from "./modules";
import { Dependancies } from "./storeTypes";

export default function reduxStore(
  dependencies: Dependancies,
  initialState: Partial<ReturnType<typeof rootReducer>>
) {
  const epicMiddleware = createEpicMiddleware({ dependencies });
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer(dependencies.history),
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  const epic$ = new BehaviorSubject(rootEpic);
  const hotReloadingEpic = (actions: any, store: any, dependancies: any): any =>
    epic$.pipe(switchMap((epic: any) => epic(actions, store, dependancies)));
  if (module.hot) {
    module.hot.accept("./modules", () => {
      store.replaceReducer(
        require("./modules").rootReducer(dependencies.history)
      ); // eslint-disable-line global-require
      epic$.next(require("./modules").rootEpic);
    });
  }

  epicMiddleware.run(hotReloadingEpic);
  setTimeout(() => store.dispatch({ type: "INIT" }), 10);
  return store;
}
