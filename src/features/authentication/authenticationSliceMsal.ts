import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AuthStoreType,
  AuthenticationSteps,
} from "../../lib/authentication/authTypes";
import {
  MsalAuthProvider,
  scopes,
  staticMsalConfig,
} from "../../lib/authentication/msalAuthProvider";

export const authProvider = new MsalAuthProvider(staticMsalConfig, scopes);

export const init = createAsyncThunk("auth/init", async () => {
  await authProvider.init();
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authProvider.logout();
});
export const Login = createAsyncThunk("auth/redirectHandle", async () => {
  authProvider.handleLoginRedirect();
  return {
    userInfo: authProvider.getUserDetail(),
    token: "",
  } as AuthStoreType;
});

export const getToken = createAsyncThunk("auth/getToken", async () => {
  const token = await authProvider.getToken();
});

export const getLoginStatus = createAsyncThunk(
  "auth/getLoginStatus",
  async () => {
    const status = authProvider.getLoginStatus();
    return status;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: AuthenticationSteps.NotStarted,
    isLoading: false,
    isError: false,
    error: {} as unknown,
    data: null as AuthStoreType | null,
  },
  reducers: {
    tokenReceived: (state, action) => {
      if (state.data) {
        state.data.token = action.payload;
      }
    },
    loggedOut: (state) => {},
  },
  extraReducers: (builder) => {
    builder

      .addCase(init.pending, (state) => {
        state.status = AuthenticationSteps.Init;
        state.isLoading = true;
      })
      .addCase(init.fulfilled, (state) => {
        state.status = AuthenticationSteps.InitComplete;
        state.isLoading = false;
      })
      .addCase(init.rejected, (state, action) => {
        state.status = AuthenticationSteps.InitComplete;
        state.isLoading = false;
        state.isError = true;
        state.error = action.error;
      })
      .addCase(Login.pending, (state) => {
        state.status = AuthenticationSteps.HandlingRedirect;
        state.isLoading = true;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.status = AuthenticationSteps.LoginComplete;
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(Login.rejected, (state, action) => {
        state.status = AuthenticationSteps.LoginError;
        state.isLoading = false;
        state.isError = true;
        state.error = action.error;
      })
      .addCase(getLoginStatus.pending, (state) => {
        state.status = AuthenticationSteps.Login;
        state.isLoading = true;
      })
      .addCase(getLoginStatus.fulfilled, (state) => {
        state.status = AuthenticationSteps.Login;
        state.isLoading = false;
      })
      .addCase(getLoginStatus.rejected, (state) => {
        state.status = AuthenticationSteps.LoginError;
        state.isLoading = false;
      });
  },
});
export const { tokenReceived, loggedOut } = authSlice.actions;
