import { ChakraProvider } from "@chakra-ui/react";
import { setupListeners } from "@reduxjs/toolkit/query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initStore } from "./app/configureStore";
import Main from "./main";
import reportWebVitals from "./reportWebVitals";
import { theme } from "./theme";

import Auth0AuthProvider from "./lib/authentication/auth0AuthProvider";
import AuthenticationProviderContext from "./lib/authentication/authenticationContext";
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
