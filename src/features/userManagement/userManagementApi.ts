import { createApi } from "@reduxjs/toolkit/query/react";

import { appFetchQuery } from "../../app/appFetchQuery";

// Types
export interface CreateUserRequest {
  userName: string;
  userSurname: string;
  userCompany: string;
  userEmail: string;
  userPhone?: string;
  userExpiryDate: string;
  userPassword: string;
}

export interface UserCreationResponse {
  generatedEmail: string;
  displayName: string;
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  exists: boolean;
  userName?: string;
}

export interface GeneratePdfRequest {
  displayName: string;
  generatedEmail: string;
  temporaryPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  expiryDate: string;
  // Add other user fields as needed
}

export interface UpdateUserRequest {
  userId: string;
  data: Partial<User>;
}

export const userManagementApi = createApi({
  reducerPath: "userManagementApi",
  baseQuery: appFetchQuery({
    baseUrl: "https://k4view-admin-test-k2e.azurewebsites.net",
    prepareHeaders: async (headers, { extra }) => {
      const token = await extra.authProvider.getToken("");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "UserInfo"],
  endpoints: builder => ({
    // Create user
    createUser: builder.mutation<UserCreationResponse, CreateUserRequest>({
      query: body => {
        const formData = new URLSearchParams();
        formData.append("userName", body.userName);
        formData.append("userSurname", body.userSurname);
        formData.append("userCompany", body.userCompany);
        formData.append("userEmail", body.userEmail);
        formData.append("userPhone", body.userPhone ?? "");
        formData.append("userExpiryDate", body.userExpiryDate);
        formData.append("userPassword", body.userPassword);

        return {
          url: "/users",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
      invalidatesTags: ["Users"],
    }),

    // Check if email exists
    checkEmail: builder.mutation<CheckEmailResponse, CheckEmailRequest>({
      query: body => {
        const formData = new URLSearchParams();
        formData.append("email", body.email);

        return {
          url: "/users/email",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),

    // Generate PDF credentials
    generatePdf: builder.mutation<Blob, GeneratePdfRequest>({
      query: body => {
        const formData = new URLSearchParams();
        formData.append("displayName", body.displayName);
        formData.append("generatedEmail", body.generatedEmail);
        formData.append("temporaryPassword", body.temporaryPassword);

        return {
          url: "/users/generatePdf",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseHandler: async response => response.blob(),
        };
      },
    }),

    // Get users (search)
    getUsers: builder.query<User[], { name?: string; surname?: string }>({
      query: params => {
        const searchParams = new URLSearchParams();
        if (params.name) searchParams.append("name", params.name);
        if (params.surname) searchParams.append("surname", params.surname);
        return `/users${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      },
      providesTags: ["Users"],
    }),

    // Get user info by ID
    getUserInfo: builder.query<User, string>({
      query: userId => `/usersInfo/${encodeURIComponent(userId)}`,
      providesTags: (_result, _error, userId) => [{ type: "UserInfo", id: userId }],
    }),

    // Update user info
    updateUserInfo: builder.mutation<void, UpdateUserRequest>({
      query: ({ userId, data }) => ({
        url: `/usersInfo/${encodeURIComponent(userId)}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: "UserInfo", id: userId }, "Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useCheckEmailMutation,
  useGeneratePdfMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} = userManagementApi;
