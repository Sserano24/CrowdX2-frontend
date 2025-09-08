// app/api/spotlight/users/route.js
import { NextResponse } from "next/server";

const DJANGO_SPOTLIGHT_URL =
  "http://127.0.0.1:8001/api/accounts/spotlight_users";

export async function GET() {
  try {
    const res = await fetch(DJANGO_SPOTLIGHT_URL, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    // Read upstream body as text first so we can show errors if parsing fails
    const upstreamText = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}`, detail: upstreamText.slice(0, 500) },
        { status: res.status }
      );
    }

    // Try to parse JSON
    let upstreamJson;
    try {
      upstreamJson = upstreamText ? JSON.parse(upstreamText) : null;
    } catch {
      return NextResponse.json(
        { error: "Upstream did not return JSON", detail: upstreamText.slice(0, 500) },
        { status: 502 }
      );
    }

    // Normalize shape: return { items: [...] } for clients expecting .items
    const normalized =
      Array.isArray(upstreamJson) ? { items: upstreamJson } : upstreamJson;

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
