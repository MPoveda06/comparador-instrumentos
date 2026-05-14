import { NextRequest, NextResponse } from "next/server";
import { createInstrument } from "@/lib/firestore";
import { searchInstrumentUrls } from "@/lib/tavily";
import type { CreateInstrumentInput } from "@/types";

// Extrae precio de un texto (ej: "€299.00" → 299)
function extractPrice(text: string): number {
  const match = text.match(/[€$£]?\s*(\d[\d.,]+)/);
  if (!match) return 0;
  return parseFloat(match[1].replace(",", "."));
}

// Detecta la tienda a partir de la URL
function extractStore(url: string): string {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    return host.split(".")[0];
  } catch {
    return "unknown";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, url } = await req.json() as { query: string; url?: string };

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Si no se pasa URL, buscamos con Tavily y cogemos el primer resultado
    let targetUrl = url;
    let content = "";
    let title = query;

    if (!targetUrl) {
      const results = await searchInstrumentUrls(query);
      if (results.length === 0) {
        return NextResponse.json({ error: "No results found" }, { status: 404 });
      }
      targetUrl = results[0].url;
      content = results[0].content;
      title = results[0].title;
    }

    // Parseo básico del título para extraer marca y nombre
    const parts = title.split(/[-–|]/);
    const name = parts[0]?.trim() ?? query;
    const brand = name.split(" ")[0] ?? "Unknown";

    const input: CreateInstrumentInput = {
      name,
      brand,
      category: "guitar", // default; el usuario puede corregir
      price: extractPrice(content),
      currency: "EUR",
      specs: {},
      sourceUrl: targetUrl,
      store: extractStore(targetUrl),
    };

    const instrument = await createInstrument(input);
    return NextResponse.json({ instrument }, { status: 201 });
  } catch (error) {
    console.error("POST /api/ingest error:", error);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
