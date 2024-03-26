import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/configureStore";
import {
  AuthStoreType,
  AuthenticationSteps,
} from "../../lib/authentication/authTypes";
import { authProvider } from "../../main";

const authProviderInstance = authProvider;

export const Init = createAsyncThunk("auth/init", async () => {
  await authProviderInstance.init();
});

export const Logout = createAsyncThunk("auth/logout", async () => {
  await authProviderInstance.logout();
});
export const Login = createAsyncThunk("auth/redirectHandle", async () => {
  return await authProviderInstance.handleLoginRedirect().then(async () => {
    var user = await authProviderInstance.getUserDetail();
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
    const status = authProviderInstance.getLoginStatus();
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
