import Anthropic from "@anthropic-ai/sdk";
import type { Instrument } from "@/types";

export interface ComparisonResult {
  winner: "a" | "b" | "draw";
  reasoning: string;
  scores: { a: number; b: number };
  recommendation: string;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function compareInstruments(
  a: Instrument,
  b: Instrument,
  context?: string
): Promise<ComparisonResult> {
  const prompt = `Eres un experto en instrumentos musicales. Compara estos dos instrumentos y decide cuál es mejor en términos de relación calidad-precio y prestaciones.

INSTRUMENTO A: ${a.name} (${a.brand})
- Precio: ${a.price} ${a.currency}
- Categoría: ${a.category}
- Tienda: ${a.store}
- Specs: ${JSON.stringify(a.specs)}

INSTRUMENTO B: ${b.name} (${b.brand})
- Precio: ${b.price} ${b.currency}
- Categoría: ${b.category}
- Tienda: ${b.store}
- Specs: ${JSON.stringify(b.specs)}

${context ? `Contexto del usuario: ${context}` : ""}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "winner": "a" | "b" | "draw",
  "reasoning": "explicación de 2-3 frases en español",
  "scores": { "a": <0-100>, "b": <0-100> },
  "recommendation": "frase corta recomendando al usuario"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude did not return valid JSON");

  return JSON.parse(jsonMatch[0]) as ComparisonResult;
}
