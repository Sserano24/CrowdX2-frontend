import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const DJANGO_UPDATE_URL = "http://127.0.0.1:8001/api/accounts/update";
const DJANGO_TOKEN_REFRESH_URL = "http://127.0.0.1:8001/api/token/refresh/";

export async function PUT(req) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    let accessToken = cookieStore.get("auth-token")?.value;
    const refreshToken = cookieStore.get("auth-refresh-token")?.value;

    if (!accessToken) {
      console.warn("⚠️ No access token found.");
    }

    // 🔁 Define a function to send update to Django
    const sendUpdateRequest = async (token) => {
      return await fetch(DJANGO_UPDATE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    };

    // 🛠️ Try the request with the current access token
    let djangoRes = await sendUpdateRequest(accessToken);

    // 🧪 If it fails with 401, try refreshing
    if (djangoRes.status === 401 && refreshToken) {
      console.log("🔁 Token expired. Trying to refresh...");

      const refreshRes = await fetch(DJANGO_TOKEN_REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshRes.ok) {
        console.error("🔒 Refresh failed");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { access } = await refreshRes.json();

      // ✅ Retry request with new token
      djangoRes = await sendUpdateRequest(access);

      // ⚠️ Optionally: set new access token cookie here
      const response = NextResponse.next();
      response.cookies.set("auth-token", access, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: "/",
        maxAge: 3600,
        sameSite: "strict",
      });

      // If Django response is OK, return its data with new token set
      if (djangoRes.ok) {
        const data = await djangoRes.json();
        response.body = JSON.stringify(data);
        response.status = djangoRes.status;
        return response;
      }
    }

    const data = await djangoRes.json();
    return NextResponse.json(data, { status: djangoRes.status });
  } catch (err) {
    console.error("❌ PUT /api/account/update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
