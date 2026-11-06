
import { authAxiosInstance } from "./axiosInstance";

const AUTH_TOKEN_KEY = "aaplaDabba_authToken";
const DEVICE_ID_KEY = "aaplaDabba_deviceId";

// LOGIN REQUEST
export interface LoginRequest {
  deviceId: string;
  deviceType: string;
  email: string;
  password: string;
}

// LOGIN RESPONSE
export interface LoginResponse {
  [key: string]: unknown;
}

// LOGOUT REQUEST
export interface LogoutRequest {
  deviceId: string;
}

// GET OR CREATE DEVICE ID
export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `web-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;

    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

// GET AUTH TOKEN
export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// SAVE AUTH TOKEN
export function saveAuthToken(token: string): void {
  if (!token || !token.trim()) {
    throw new Error("Authentication token is required.");
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

// CLEAR AUTH TOKEN
export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// EXTRACT TOKEN FROM RESPONSE
function extractAuthToken(response: unknown): string | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  if (Array.isArray(response)) {
    return null;
  }

  const object = response as Record<string, unknown>;

  const tokenKeys = [
    "accessToken",
    "AccessToken",
    "token",
    "Token",
    "jwtToken",
    "JwtToken",
    "access_token",
  ];

  for (const key of tokenKeys) {
    const value = object[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  for (const key of ["data", "Data", "result", "Result"]) {
    const nested = object[key];

    if (nested && typeof nested === "object") {
      const token = extractAuthToken(nested);

      if (token) {
        return token;
      }
    }
  }

  return null;
}

// LOGIN API
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  const requestBody: LoginRequest = {
    deviceId: getDeviceId(),
    deviceType: "Web",
    email: email.trim(),
    password,
  };

  const response = await authAxiosInstance.post(
    "/Login",
    requestBody
  );

  const data = response.data as LoginResponse;

  console.log("Login API Response:", data);

  const token = extractAuthToken(data);

  if (token) {
    saveAuthToken(token);
    console.log("Authentication token saved.");
  } else {
    console.warn(
      "Login successful, but token field was not found in the response."
    );
  }

  return data;
}

// LOGOUT API
export async function logout(): Promise<unknown> {
  const token = getAuthToken();

  try {
    const response = await authAxiosInstance.post(
      "/Logout",
      {
        deviceId: getDeviceId(),
      } satisfies LogoutRequest,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    return response.data;
  } finally {
    clearAuthToken();
  }
}
