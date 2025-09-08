import { NextResponse } from "next/server";



const DJANGO_SPOTLIGHT_URL = "http://127.0.0.1:8001/api/campaigns/spotlight";

export async function GET() {
  try {
    const res = await fetch(DJANGO_SPOTLIGHT_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Django returned ${res.status}`);
    const data = await res.json(); // { items: [...] }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
