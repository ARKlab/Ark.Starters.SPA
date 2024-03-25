import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AuthStoreType,
  AuthenticationSteps,
} from "../../lib/authentication/authTypes";
import { Auth0AuthProvider } from "../../lib/authentication/auth0AuthProvider";
import { MsalAuthProvider } from "../../lib/authentication/msalAuthProvider";
import { m } from "framer-motion";
import { staticMsalConfig, scopes } from "./staticConfigs";
import { RootState } from "../../app/configureStore";

//export const authProvider = new Auth0AuthProvider(authConfig);
export const authProvider = new MsalAuthProvider(staticMsalConfig, scopes);

export const Init = createAsyncThunk("auth/init", async () => {
  await authProvider.init();
});

export const Logout = createAsyncThunk("auth/logout", async () => {
  await authProvider.logout();
});
export const Login = createAsyncThunk("auth/redirectHandle", async () => {
  return await authProvider.handleLoginRedirect().then(async () => {
    var user = await authProvider.getUserDetail();
    if (!user) return null;
    return {
      userInfo: user,
      token: "",
    } as AuthStoreType;
  });
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
      .addCase(Init.pending, (state) => {
        return { ...state, status: AuthenticationSteps.Init, isLoading: true };
      })
      .addCase(Init.fulfilled, (state) => {
        return {
          ...state,
          status: AuthenticationSteps.InitComplete,
          isLoading: false,
        };
      })
      .addCase(Init.rejected, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.InitComplete,
          isLoading: false,
          isError: true,
          error: action.error,
        };
      })
      .addCase(Login.pending, (state) => {
        return {
          ...state,
          status: AuthenticationSteps.HandlingRedirect,
          isLoading: true,
        };
      })
      .addCase(Login.fulfilled, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.LoginComplete,
          isLoading: false,
          data: action.payload,
        };
      })
      .addCase(Login.rejected, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.LoginError,
          isLoading: false,
          isError: true,
          error: action.error,
        };
      })
      .addCase(Logout.rejected, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.LogoutError,
          isLoading: false,
          isError: true,
          error: action.error,
        };
      })
      .addCase(getLoginStatus.pending, (state) => {
        return { ...state, status: AuthenticationSteps.Login, isLoading: true };
      })
      .addCase(getLoginStatus.fulfilled, (state) => {
        return {
          ...state,
          status: AuthenticationSteps.Login,
          isLoading: false,
        };
      })
      .addCase(getLoginStatus.rejected, (state) => {
        return {
          ...state,
          status: AuthenticationSteps.LoginError,
          isLoading: false,
        };
      });
  },
});
export const { tokenReceived, loggedOut } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth.data?.token;
