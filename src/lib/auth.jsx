import { cookies } from "next/headers";

const TOKEN_AGE = 3600;
const TOKEN_ACCESS_NAME = "auth-token";
const TOKEN_REFRESH_NAME = "auth-refresh-token";
const DJANGO_TOKEN_REFRESH_URL = "http://localhost:8001/api/token/refresh";
const DJANGO_VERIFY_URL = "http://127.0.0.1:8001/api/token/verify/";

// ========== Token Accessors ==========

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_ACCESS_NAME)?.value || null;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_REFRESH_NAME)?.value || null;
}


export async function setAccessToken(token) {
  const cookieStore = await cookies();
  await cookieStore.set(TOKEN_ACCESS_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: TOKEN_AGE,
  });
}

export async function setRefreshToken(token) {
  const cookieStore = await cookies();
  await cookieStore.set(TOKEN_REFRESH_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: TOKEN_AGE,
  });
}


export async function deleteTokens() {
  const cookieStore = await cookies();
  await cookieStore.delete(TOKEN_ACCESS_NAME);
  await cookieStore.delete(TOKEN_REFRESH_NAME);
}


// ========== Token Verification & Refresh ==========

async function verifyAccessToken(token) {
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

export async function refreshAccessToken() {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(DJANGO_TOKEN_REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      console.warn("Token refresh failed:", await res.text());
      return null;
    }

    const data = await res.json();
    if (data.access) {
      await setAccessToken(data.access);
      return data.access;
    }

    return null;
  } catch (error) {
    console.error("Refresh error:", error);
    return null;
  }
}

// ========== Protected Token Wrapper ==========

export async function withValidAccessToken(callback) {
  let access = await getAccessToken();

  const isValid = await verifyAccessToken(access);

  if (!isValid) {
    access = await refreshAccessToken();
    if (!access) throw new Error("Session expired. Please log in again.");
  }

  return callback(access);
}
