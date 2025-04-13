import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Get JWT token from cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/auth-token=([^;]+)/);
    const token = match?.[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Proxy request to Django backend with Authorization header
    const djangoRes = await fetch("http://127.0.0.1:8001/api/campaigns/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await djangoRes.json();
    return NextResponse.json(data, { status: djangoRes.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
