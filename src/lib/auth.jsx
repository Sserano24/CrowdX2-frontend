const {cookies} = require("next/headers")

const TOKEN_AGE = 3600
const TOKEN_NAME = "auth-token"
const TOKEN_REFRESH_NAME = "auth-refresh-token"
const isBrowser = typeof window !== "undefined";


export async function getToken() {
    if (isBrowser) {
      const match = document.cookie.match(/auth-token=([^;]+)/);
      return match?.[1] || null;
    } else {
      const { cookies } = await import("next/headers");
      const cookieStore = cookies();
      return cookieStore.get(TOKEN_NAME)?.value || null;
    }
  }
  
  export async function getRefreshToken() {
    if (isBrowser) {
      const match = document.cookie.match(/auth-refresh-token=([^;]+)/);
      return match?.[1] || null;
    } else {
      const { cookies } = await import("next/headers");
      const cookieStore = cookies();
      return cookieStore.get(REFRESH_NAME)?.value || null;
    }
  }


export async function setToken(authToken) {
    const cookieStore = await cookies(); // ✅ Await before using
    return cookieStore.set(TOKEN_NAME, authToken, { 
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: TOKEN_AGE, 
    });
}

export async function setRefreshToken(authRefreshToken) {
    const cookieStore = await cookies(); // ✅ Await before using
    return cookieStore.set(TOKEN_REFRESH_NAME, authRefreshToken, { 
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: TOKEN_AGE, 
    });
}

export function deleteToken(){
    //logout
    cookies().delete(TOKEN_REFRESH_NAME)
    return cookies().delete(TOKEN_NAME);
}

