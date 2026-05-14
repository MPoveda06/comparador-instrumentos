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

export interface CreateInstrumentDto {
  name: string;
  brand: string;
  category: InstrumentCategory;
  price: number;
  currency: string;
  imageUrl?: string;
  specs?: Record<string, string>;
  sourceUrl: string;
  store: string;
}
