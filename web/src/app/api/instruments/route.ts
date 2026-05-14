import { NextRequest, NextResponse } from "next/server";
import { listInstruments, createInstrument, searchInstruments } from "@/lib/firestore";
import type { CreateInstrumentInput } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category") ?? undefined;

    const instruments = q
      ? await searchInstruments(q)
      : await listInstruments(category);

    return NextResponse.json({ instruments });
  } catch (error) {
    console.error("GET /api/instruments error:", error);
    return NextResponse.json({ error: "Error fetching instruments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CreateInstrumentInput;
    const instrument = await createInstrument(body);
    return NextResponse.json({ instrument }, { status: 201 });
  } catch (error) {
    console.error("POST /api/instruments error:", error);
    return NextResponse.json({ error: "Error creating instrument" }, { status: 500 });
  }
}
