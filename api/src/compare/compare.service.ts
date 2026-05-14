import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Instrument } from '../instruments/instrument.types';

export interface ComparisonResult {
  winner: 'a' | 'b' | 'draw';
  reasoning: string;
  scores: { a: number; b: number };
  recommendation: string;
}

const K = 32;

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function updateRatings(ratingA: number, ratingB: number, outcome: 'a' | 'b' | 'draw') {
  const expA = expectedScore(ratingA, ratingB);
  const scoreA = outcome === 'a' ? 1 : outcome === 'draw' ? 0.5 : 0;
  return {
    newRatingA: Math.round(ratingA + K * (scoreA - expA)),
    newRatingB: Math.round(ratingB + K * ((1 - scoreA) - (1 - expA))),
  };
}

@Injectable()
export class CompareService {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async compare(a: Instrument, b: Instrument, context?: string): Promise<ComparisonResult> {
    const prompt = `Eres un experto en instrumentos musicales. Compara estos dos instrumentos y decide cuál es mejor en relación calidad-precio.

INSTRUMENTO A: ${a.name} (${a.brand}) — ${a.price}${a.currency} — ${a.store}
INSTRUMENTO B: ${b.name} (${b.brand}) — ${b.price}${b.currency} — ${b.store}
${context ? `Contexto del usuario: ${context}` : ''}

Responde SOLO con JSON válido:
{"winner":"a"|"b"|"draw","reasoning":"2-3 frases en español","scores":{"a":0-100,"b":0-100},"recommendation":"frase corta"}`;

    const msg = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Claude no devolvió JSON válido');
    return JSON.parse(match[0]) as ComparisonResult;
  }
}
