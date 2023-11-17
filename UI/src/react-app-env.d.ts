/// <reference types="react-scripts" />
/// <reference types="webpack-env" />

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: <R>(...a: R[]) => R;
}

declare module "idtoken-verifier"
