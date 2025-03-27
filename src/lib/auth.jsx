const {cookies} = require("next/headers")

const TOKEN_AGE = 3600
const TOKEN_NAME = "auth-token"
const TOKEN_REFRESH_NAME = "auth-refresh-token"


export async function getToken(){
    const cookieStore = await cookies();  // ✅ Await is now valid
    const myAuthToken = cookieStore.get(TOKEN_NAME);
    return myAuthToken?.value;
}

export async function getRefreshToken(){
    const cookieStore = await cookies();  // ✅ Await cookies() before using it
    const myAuthToken = cookieStore.get(TOKEN_REFRESH_NAME);
    return myAuthToken?.value;
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

