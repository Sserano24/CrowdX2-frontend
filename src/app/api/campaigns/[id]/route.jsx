import { NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, refreshAccessToken, setAccessToken } from "@/lib/auth";

export async function GET(req, ctx) {
  const { id } = await ctx.params;   // ✅ await params

  if (!id) {
    return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
  }

  const fetchCampaign = (token) =>
    fetch(`http://localhost:8001/api/campaigns/detail/${id}/`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

  let access = await getAccessToken();
  let refresh = await getRefreshToken();
  let res = await fetchCampaign(access);

  if (res.status === 401 || res.status === 403) {
    const newAccess = await refreshAccessToken(refresh);
    if (newAccess) {
      access = newAccess;
      res = await fetchCampaign(access);
    }
  }

  if (!res.ok) {
  // Redirect to signin page if unauthorized or failed to fetch
  return NextResponse.json(
  { error: "Non valid tokens" }, 
  { status: 401 }
);
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}
