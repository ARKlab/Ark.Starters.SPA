import { createAsyncThunk } from "@reduxjs/toolkit";

import type { ExtraType } from "../../app/configureStore";
import { createAppSlice } from "../../app/createAppSlice";

import type { AuthStoreType } from "./authTypes";
import { AuthenticationSteps } from "./authTypes";

export const HandleRedirect = createAsyncThunk("auth/handleRedirect", async (_, thunkAPI) => {
  const authProviderInstance = (thunkAPI.extra as ExtraType).authProvider;
  await authProviderInstance.handleLoginRedirect();
  const user = await authProviderInstance.getUserDetail();
  if (!user) return null;
  return {
    userInfo: user,
    token: "",
  } as AuthStoreType;
});

export const DetectLoggedInUser = createAsyncThunk("auth/setLoggedUser", async (_, thunkAPI) => {
  const authProviderInstance = (thunkAPI.extra as ExtraType).authProvider;
  const user = await authProviderInstance.getUserDetail();

  if (!user || user.username === "") return null;
  return {
    userInfo: user,
    token: "",
  } as AuthStoreType;
});

export const Logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const authProviderInstance = (thunkAPI.extra as ExtraType).authProvider;
  authProviderInstance.logout();
});

export const Login = createAsyncThunk("auth/redirectHandle", async (_, thunkAPI) => {
  const authProviderInstance = (thunkAPI.extra as ExtraType).authProvider;
  authProviderInstance.login();
});

export const getLoginStatus = createAsyncThunk("auth/getLoginStatus", async (_, thunkAPI) => {
  const authProviderInstance = (thunkAPI.extra as ExtraType).authProvider;
  const status = authProviderInstance.getLoginStatus();
  return status;
});

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    status: AuthenticationSteps.NotStarted,
    isLoading: false,
    isError: false,
    error: {} as unknown,
    data: null as AuthStoreType | null,
  },
  reducers: c => ({
    tokenReceived: c.reducer<string | null>((state, action) => {
      if (state.data) {
        state.data.token = action.payload;
      }
    }),
    loggedOut: () => {},
  }),
  extraReducers: builder => {
    builder
      .addCase(DetectLoggedInUser.pending, state => {
        return { ...state, status: AuthenticationSteps.Init, isLoading: true };
      })
      .addCase(DetectLoggedInUser.fulfilled, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.InitComplete,
          isLoading: false,
          data: action.payload,
        };
      })
      .addCase(HandleRedirect.pending, state => {
        return { ...state, status: AuthenticationSteps.Init, isLoading: true };
      })
      .addCase(HandleRedirect.fulfilled, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.InitComplete,
          isLoading: false,
          data: action.payload,
        };
      })
      .addCase(HandleRedirect.rejected, (state, action) => {
        return {
          ...state,
          status: AuthenticationSteps.InitComplete,
          isLoading: false,
          isError: true,
          error: action.error,
        };
      })
      .addCase(Login.pending, state => {
        return {
          ...state,
          status: AuthenticationSteps.HandlingRedirect,
          isLoading: true,
        };
      })
      .addCase(Login.fulfilled, state => {
        return {
          ...state,
          status: AuthenticationSteps.LoginComplete,
          isLoading: false,
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
      .addCase(getLoginStatus.pending, state => {
        return { ...state, status: AuthenticationSteps.Login, isLoading: true };
      })
      .addCase(getLoginStatus.fulfilled, state => {
        return {
          ...state,
          status: AuthenticationSteps.Login,
          isLoading: false,
        };
      })
      .addCase(getLoginStatus.rejected, state => {
        return {
          ...state,
          status: AuthenticationSteps.LoginError,
          isLoading: false,
        };
      });
  },
  selectors: {
    tokenSelector: state => state.data?.token,
    userSelector: state => state.data?.userInfo,
  },
});
export const { tokenReceived, loggedOut } = authSlice.actions;

export const { tokenSelector, userSelector } = authSlice.selectors;
export const authSelector = authSlice.selectSlice;
