import { NextRequest, NextResponse } from "next/server";
import { getInstrument } from "@/lib/firestore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const instrument = await getInstrument(id);
    if (!instrument) {
      return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
    }
    return NextResponse.json({ instrument });
  } catch (error) {
    console.error("GET /api/instruments/[id] error:", error);
    return NextResponse.json({ error: "Error fetching instrument" }, { status: 500 });
  }
}
