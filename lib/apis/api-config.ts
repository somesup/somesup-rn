import { router } from "expo-router";
import { camelize } from "@/lib/utils/camelize";
import { SITEMAP } from "@/data/sitemap";
import { APIResult } from "@/types/dto";
import { clearExpiredTokens, getToken, removeToken, setToken } from "../utils/token";

const API_URL = "https://somesup-server-pscgr63r2q-du.a.run.app/api";

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await getToken("refreshToken");

  if (!refreshToken) return "";

  try {
    const response = await fetch(API_URL + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await removeToken("accessToken");
      await removeToken("refreshToken");
      return "";
    }

    const result = await response.json();

    await setToken("accessToken", result.data.accessToken);
    await setToken("refreshToken", result.data.refreshToken);

    return result.data.accessToken;
  } catch (error) {
    console.error(error);
    return "";
  }
};

const prepareHeaders = async (headers: HeadersInit = {}): Promise<HeadersInit> => {
  const accessToken = await getToken("accessToken");

  return {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...headers,
  };
};

export const myFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResult<T>> => {
  try {
    const { headers = {}, ...restOptions } = options;

    await clearExpiredTokens();

    const preparedHeaders = await prepareHeaders(headers);

    const defaultOptions: RequestInit = {
      headers: preparedHeaders,
      ...restOptions,
    };

    const response = await fetch(API_URL + endpoint, defaultOptions);
    const xCache = response.headers.get("x-cache");

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) {
        if (endpoint.split("/").at(-1) !== "verify") router.replace(SITEMAP.ONBOARDING);
        return {
          error: { status: 401, message: "Authentication failed" },
          data: null,
        };
      }

      const retryHeaders = await prepareHeaders(headers);
      const retryOptions: RequestInit = {
        ...defaultOptions,
        headers: retryHeaders,
      };

      const retryResponse = await fetch(API_URL + endpoint, retryOptions);
      const retryXCache = retryResponse.headers.get("x-cache");
      const retryResult = await retryResponse.json();

      if (!retryResponse.ok) {
        return {
          error: { status: retryResponse.status, message: retryResult.message },
          data: null,
        };
      }

      return {
        error: null,
        data: camelize(retryResult.data),
        pagination: retryResult.pagination,
        xCache: retryXCache,
      };
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        error: { status: response.status, message: result.message },
        data: null,
      };
    }

    return { error: null, data: camelize(result.data), pagination: result.pagination, xCache };
  } catch (error) {
    console.error(error);
    return {
      error: {
        status: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      data: null,
    };
  }
};

const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestInit) => {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(
        ([key, value]) => !!value && searchParams.append(key, String(value))
      );

      const queryString = searchParams.toString();
      if (queryString) url += (url.includes("?") ? "&" : "?") + queryString;
    }

    return myFetch<T>(url, { method: "GET", ...options });
  },

  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    myFetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    myFetch<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    myFetch<T>(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
};

export default api;
