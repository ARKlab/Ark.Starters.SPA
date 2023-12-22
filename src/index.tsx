import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { EnvParams, getEnv } from "./environment";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme";
import { store } from "./app/configureStore";
import reportWebVitals from "./reportWebVitals";
import Main from "./main";

const Index = () => {
  const [env, setEnv] = useState<EnvParams | null>(null);

  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const env = await getEnv();
        setEnv(env);
      } catch (error) {
        console.error("Failed to get environment", error);
      }
    };

    fetchEnv();
  }, []);

  if (!env) {
    return null;
  }
  return <Main />;

  /* 
  
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
  });*/
};
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
