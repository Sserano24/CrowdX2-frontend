// File: /app/api/logout/route.js
import { deleteTokens } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await deleteTokens(); // this can safely use cookies()
  return NextResponse.json({ success: true });
}
