import { cookies } from "next/headers";

const ACCESS_COOKIE_MAX_AGE = 60 * 60;        // 1 hour
const REFRESH_COOKIE_MAX_AGE = 12 * 60 * 60;  // 12 hours
const TOKEN_ACCESS_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";
const DJANGO_TOKEN_REFRESH_URL = "http://localhost:8001/api/token/refresh";
const DJANGO_VERIFY_URL = "http://127.0.0.1:8001/api/token/verify";

// lib/auth.jsx
export async function getAccessToken() {
  const store = await cookies();
  const c = store.get(TOKEN_ACCESS_NAME);
  return c ? c.value : null;

}

export async function getRefreshToken() {
  const store = await cookies();
  const c = store.get(TOKEN_REFRESH_NAME);
  return c ? c.value : null;
}

export async function setAccessToken(token) {
  const store = await cookies();
  store.set(TOKEN_ACCESS_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });
}

export async function setRefreshToken(token) {
  const store = await cookies();
  store.set(TOKEN_REFRESH_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

 export async function deleteTokens() {
  const store = await cookies();
  store.delete(TOKEN_ACCESS_NAME);
  store.delete(TOKEN_REFRESH_NAME);
}

// ========== Token Verification & Refresh ==========

export async function verifyAccessToken(token) {
  if (!token) return false;

  try {
    const res = await fetch(DJANGO_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function refreshAccessToken(refresh) {
  "returns a new access token string, or null on failure";

  try {
    const res = await fetch(DJANGO_TOKEN_REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.access) {
      return data.access;
    }
    return null;
  } catch {
    return new Error("Failed to refresh token");
  }
}

// ========== Protected Token Wrapper ==========

export async function withValidAccessToken(access, callback) {

  const isValid = await verifyAccessToken(access);
  if (isValid) {
    return callback(access);
  }

  throw new Error("NON-VALID ACCESS TOKEN");
}

