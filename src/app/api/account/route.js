// app/api/account/route.js
import { withValidAccessToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const DJANGO_USER_URL = "http://127.0.0.1:8001/api/accounts/user";

export async function GET() {
  try {
    const userData = await withValidAccessToken(async (accessToken) => {
      const res = await fetch(DJANGO_USER_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      return await res.json();
    });

    return NextResponse.json(userData);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
