import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserHistory as createHistory } from "history";
import App from "./App";
import CreateStore from "./redux/configureStore";
import { getEnv } from "./environment";
import * as RxOp from "rxjs/operators";
import "@fortawesome/fontawesome-pro/css/all.css";
import { createAuthHelpers } from "./redux/authHelpers";
import "./services";
import { createService } from "./services";
import {
  defaultLanguage,
  initialState,
  Selectors,
} from "./redux/modules/language";

import * as msal from "@azure/msal-browser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./main";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";

const history = createHistory();
getEnv
  .pipe(
    RxOp.map((env) => {
      let policy = env.signUpSignInPolicyId;

      const authority = `${env.knownAuthorities}/${env.domain}/${policy}`;
      const scopes = [`${env.scopes}`];

      const msalInstance = new msal.PublicClientApplication({
        auth: {
          clientId: env.clientID,
          authority: authority,
          knownAuthorities: [env.knownAuthorities],
          redirectUri: window.location.origin,
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false,
        },
      });

      const authHelpers = createAuthHelpers(msalInstance);

      const request = createService({
        baseUrl: `${env.serviceUrl}`,
        authHelpers,
        scopes: scopes,
      });

      const store = CreateStore(
        {
          auth: msalInstance,
          authHelpers,
          env,
          history,
          request,
        },
        {
          language: {
            ...initialState,
            selectedLanguage:
              /*LANG_MOD*/ /*localStorage.getItem("language") ||*/ defaultLanguage,
          },
        }
      );
      const languageSelector = () =>
        Selectors.all(store.getState()).selectedLanguage;
      request.updateLanguage(languageSelector);
      return store;
    })
  )
  .subscribe((store) => {
    const render = (Component: any) => {
      const rootElement = document.getElementById("root");

      if (rootElement) {
        const root = createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <Provider store={store}>
              <BrowserRouter>
                <ChakraProvider resetCSS={true} theme={theme}>
                  <Routes>
                    <Route path="/*" element={<Main />} />
                  </Routes>
                </ChakraProvider>
              </BrowserRouter>
            </Provider>
          </React.StrictMode>
        );
      }
    };

    if (module.hot) {
      module.hot.accept("./App.tsx", () => {
        render(App);
      });
    }
    render(App);
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
