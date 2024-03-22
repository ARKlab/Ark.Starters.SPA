import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  serviceUrl: "",
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
      return await fetchConnectionStrings();
    } catch (error) {
      console.error("Failed to fetch connection strings", error);
      return staticConfig;
    }
  }
};

export const fetchEnvParams = createAsyncThunk("env/fetch", async () => {
  const envParams = await getEnv();
  return envParams;
});

export const envSlice = createSlice({
  name: "env",
  initialState: { data: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvParams.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnvParams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchEnvParams.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});
