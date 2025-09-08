import { NextResponse } from "next/server";





const DJANGO_STATS_URL = "http://127.0.0.1:8001/api/campaigns/stats";

export async function GET() {
  try {
    const res = await fetch(DJANGO_STATS_URL, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`Django API returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}