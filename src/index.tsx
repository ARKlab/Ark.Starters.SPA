import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { EnvParams, getEnv } from "./environment";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "./theme";
import reportWebVitals from "./reportWebVitals";
import Main from "./main";
import { initStore } from "./app/configureStore";
import { AuthProvider } from "./lib/authentication/authProviderInterface";
import { setupListeners } from "@reduxjs/toolkit/query";
import { MsalAuthProvider } from "./lib/authentication/msalAuthProvider";

import AuthenticationProviderContext from "./lib/authentication/authenticationContext";
import { AuthenticationComponent } from "./lib/authentication/authenticationComponent";
import Auth0AuthProvider from "./lib/authentication/auth0AuthProvider";
const env = window.customSettings;
console.log(env);
const authProvider = new Auth0AuthProvider(env);
const store = initStore(authProvider);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);

async function initApplication() {
  await authProvider.init();
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <AuthenticationProviderContext authProvider={authProvider}>
        <Provider store={store}>
          <BrowserRouter>
            <ChakraProvider theme={theme}>
              <Routes>
                <Route path="/*" element={<Main />} />
              </Routes>
            </ChakraProvider>
          </BrowserRouter>
        </Provider>
      </AuthenticationProviderContext>
    </React.StrictMode>
  );

  reportWebVitals();
}

initApplication();
