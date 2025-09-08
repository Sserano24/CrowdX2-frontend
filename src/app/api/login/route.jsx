"use server";

import {
  setRefreshToken,
  setAccessToken,
  getAccessToken,
  getRefreshToken
} from "@/lib/auth";
import { NextResponse } from "next/server";

const DJANGO_PAIR_URL = "http://127.0.0.1:8001/api/token/pair";

export async function POST(request) {
  try {

    const requestData = await request.json();
    const jsonData = JSON.stringify(requestData);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };

    const response = await fetch(DJANGO_PAIR_URL, requestOptions);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log("Login Successful:", responseData);

    const { access, refresh } = responseData;

    // 🍪 Store both tokens in secure HttpOnly cookies
  await setAccessToken(access);
  await setRefreshToken(refresh);

  // Print the saved tokens from cookies
  const savedAccess = await getAccessToken();
  const savedRefresh = await getRefreshToken();
  console.log("[LOGIN ROUTE] Saved access token in cookies:", savedAccess);
  console.log("[LOGIN ROUTE] Saved refresh token in cookies:", savedRefresh);

  return NextResponse.json({ loggedIn: true }, { status: 200 });

  } catch (error) {
    console.error("Error Setting Tokens, check dhango api/token/pait", error);
    return NextResponse.json(
      { loggedIn: false, error: error.message },
      { status: 500 }
    );
  }
}
