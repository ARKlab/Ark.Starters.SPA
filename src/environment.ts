export type EnvParams = {
  clientID: string;
  domain: string;
  scopes: string;
  knownAuthorities: string;
  signUpSignInPolicyId: string;
  serviceUrl: string;
};

const staticConfig: EnvParams = {
  clientID: "",
  domain: "",
  scopes: "",
  knownAuthorities: "",
  signUpSignInPolicyId: "B2C_1_SignUpSignIn1",
  serviceUrl: "https://www.yourserviceurl.com", //CHANGE THIS WITH YOUR REAL SERVICE
};

const fetchConnectionStrings = async (): Promise<EnvParams> => {
  const response = await fetch("/connectionStrings.js");
  if (!response.ok) {
    throw new Error("Failed to fetch connection strings");
  }
  const data: EnvParams = await response.json();
  return data;
};

export const getEnv = async (): Promise<EnvParams> => {
  if (process.env.NODE_ENV === "development") {
    return staticConfig;
  } else {
    try {
      const connectionStrings = await fetchConnectionStrings();
      return {
        ...connectionStrings,
      };
    } catch (error) {
      console.error("Failed to fetch connection strings", error);
      return staticConfig;
    }
  }
};
