import { NextRequest, NextResponse } from "next/server";
import { searchInstrumentUrls } from "@/lib/tavily";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });
    }

    const results = await searchInstrumentUrls(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
