import { NextRequest, NextResponse } from "next/server";
import { getInstrument, updateEloRating } from "@/lib/firestore";
import { compareInstruments } from "@/lib/claude";
import { updateRatings } from "@/lib/elo";

export async function POST(req: NextRequest) {
  try {
    const { instrumentAId, instrumentBId, context } = await req.json() as {
      instrumentAId: string;
      instrumentBId: string;
      context?: string;
    };

    if (!instrumentAId || !instrumentBId) {
      return NextResponse.json({ error: "Missing instrument IDs" }, { status: 400 });
    }

    const [a, b] = await Promise.all([
      getInstrument(instrumentAId),
      getInstrument(instrumentBId),
    ]);

    if (!a || !b) {
      return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
    }

    const comparison = await compareInstruments(a, b, context);

    const { newRatingA, newRatingB } = updateRatings(
      a.eloRating,
      b.eloRating,
      comparison.winner
    );

    await Promise.all([
      updateEloRating(instrumentAId, newRatingA),
      updateEloRating(instrumentBId, newRatingB),
    ]);

    return NextResponse.json({
      comparison,
      instruments: {
        a: { ...a, eloRating: newRatingA },
        b: { ...b, eloRating: newRatingB },
      },
    });
  } catch (error) {
    console.error("POST /api/compare error:", error);
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 });
  }
}
