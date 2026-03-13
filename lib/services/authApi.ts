import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth/constants";

const rawApiBaseUrl = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").trim();
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
export const apiBaseUrl = normalizedApiBaseUrl.endsWith("/api")
  ? normalizedApiBaseUrl.slice(0, -4)
  : normalizedApiBaseUrl;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((item) => item.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  researcherType?: string;
  institute?: string;
  department?: string;
  position?: string;
  gender?: string;
  termsAccepted: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  researcherType: string | null;
  institute: string | null;
  department: string | null;
  position: string | null;
  gender: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  createdAt: string;
};

export type AuthResponse = {
  message: string;
  token?: string;
  user: UserDto;
};

export type CurrentUserResponse = {
  message?: string;
  user: UserDto;
};

export type UpdateProfileMediaPayload = {
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiBaseUrl}/api`,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token =
          window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || readCookie(AUTH_COOKIE_NAME);

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupPayload>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    updateProfileMedia: builder.mutation<CurrentUserResponse, UpdateProfileMediaPayload>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMediaMutation,
} = authApi;
