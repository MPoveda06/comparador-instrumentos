export type InstrumentCategory = 'guitar' | 'bass' | 'keyboard' | 'drums' | 'wind' | 'string' | 'other';

export interface Instrument {
  id: string;
  name: string;
  brand: string;
  category: InstrumentCategory;
  price: number;
  currency: string;
  imageUrl?: string;
  specs: Record<string, string>;
  sourceUrl: string;
  store: string;
  eloRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonResult {
  winner: 'a' | 'b' | 'draw';
  reasoning: string;
  scores: { a: number; b: number };
  recommendation: string;
}

export interface CompareResponse {
  comparison: ComparisonResult;
  instruments: { a: Instrument; b: Instrument };
}

export const CATEGORY_LABELS: Record<string, string> = {
  guitar: 'Guitarras Eléctricas',
  bass: 'Bajos',
  keyboard: 'Pianos & Teclados',
  drums: 'Baterías',
  wind: 'Viento',
  string: 'Cuerda',
  other: 'Otros',
};
