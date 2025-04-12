import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/campaigns/mine";

export async function GET(request) {
  try {
    // Step 1: Extract cookies from the incoming request
    const cookieHeader = request.headers.get("cookie") || "";

    // Step 2: Look for the auth-token (access token) in the cookies
    const match = cookieHeader.match(/auth-token=([^;]+)/);
    const accessToken = match?.[1];

    // Step 3: If no token is found, return 401 Unauthorized
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    // Step 4: Send a request to Django backend with the token in the header
    const res = await fetch(DJANGO_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Clone the response to safely fall back to text if JSON parsing fails
    const resClone = res.clone();

    let data;
    try {
      // Step 5: Attempt to parse response as JSON
      data = await res.json();
    } catch (err) {
      // If JSON parsing fails, fall back to reading it as raw text
      const rawText = await resClone.text();
      return NextResponse.json(
        { error: "Django returned non-JSON response", raw: rawText },
        { status: res.status }
      );
    }

    // Step 6: If the Django API returns an error status, forward the message
    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to fetch user campaigns" },
        { status: res.status }
      );
    }

    // Step 7: Return the campaigns data as JSON with a 200 OK status
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    // Catch-all for unexpected server errors
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
