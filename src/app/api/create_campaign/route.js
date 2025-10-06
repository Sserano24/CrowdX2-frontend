// src/app/api/create_campaign/route.js
import { NextResponse } from "next/server";

const DJANGO_CREATE_CAMPAIGN_URL = "http://127.0.0.1:8001/api/campaigns/createnew";

export async function POST(request) {
  try {
    // Expect JSON from the client
    const json = await request.json();

    // Forward JSON to Django
    const resp = await fetch(DJANGO_CREATE_CAMPAIGN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    const ct = resp.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await resp.json() : await resp.text();

    if (!resp.ok) {
      return NextResponse.json(
        {
          error:
            (typeof data === "string" ? data : data?.detail || data?.error) ||
            "Failed to create campaign",
        },
        { status: resp.status }
      );
    }

    return NextResponse.json(
      { message: "Campaign created successfully", data: typeof data === "string" ? { detail: data } : data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create campaign error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
