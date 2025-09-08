// app/api/campaigns/search/route.js
import { NextResponse } from "next/server";

const DJANGO_SEARCH_URL = "http://127.0.0.1:8001/api/campaigns/search";

export async function GET(req) {
  try {
    // Forward only supported params
    const { searchParams } = new URL(req.url);
    const allowed = [
      "q",
      "tags",
      "school",
      "min_goal",
      "max_goal",
      "sort",
      "page",
      "page_size",
    ];
    const out = new URLSearchParams();
    for (const k of allowed) {
      const v = searchParams.get(k);
      if (v !== null && v !== "") out.set(k, v);
    }

    const upstreamUrl = `${DJANGO_SEARCH_URL}?${out.toString()}`;
    console.log("[search proxy] →", upstreamUrl);


    const res = await fetch(upstreamUrl, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    // Return Django's response body as-is (but still validate it's JSON)
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}`, detail: text.slice(0, 800) },
        { status: res.status }
      );
    }

    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { error: "Upstream did not return valid JSON" },
        { status: 502 }
      );
    }

    // No normalization: Django already returns { items, total, page, page_size }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
