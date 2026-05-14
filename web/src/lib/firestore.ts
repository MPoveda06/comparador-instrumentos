import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Instrument, CreateInstrumentInput } from "@/types";

const COLLECTION = "instruments";

function toInstrument(id: string, data: Record<string, unknown>): Instrument {
  return {
    id,
    name: data.name as string,
    brand: data.brand as string,
    category: data.category as Instrument["category"],
    price: data.price as number,
    currency: (data.currency as string) ?? "EUR",
    imageUrl: data.imageUrl as string | undefined,
    specs: (data.specs as Record<string, string>) ?? {},
    sourceUrl: data.sourceUrl as string,
    store: data.store as string,
    eloRating: (data.eloRating as number) ?? 1000,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string),
  };
}

export async function createInstrument(input: CreateInstrumentInput): Promise<Instrument> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    eloRating: 1000,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return toInstrument(ref.id, snap.data() as Record<string, unknown>);
}

export async function getInstrument(id: string): Promise<Instrument | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return toInstrument(snap.id, snap.data() as Record<string, unknown>);
}

export async function listInstruments(
  category?: string,
  limitCount = 20
): Promise<Instrument[]> {
  const ref = collection(db, COLLECTION);
  const q = category
    ? query(ref, where("category", "==", category), orderBy("eloRating", "desc"), limit(limitCount))
    : query(ref, orderBy("eloRating", "desc"), limit(limitCount));

  const snap = await getDocs(q);
  return snap.docs.map((d) => toInstrument(d.id, d.data() as Record<string, unknown>));
}

export async function searchInstruments(searchQuery: string): Promise<Instrument[]> {
  // Búsqueda simple por nombre (Firestore no tiene full-text; Tavily lo hará en Día 3)
  const snap = await getDocs(collection(db, COLLECTION));
  const q = searchQuery.toLowerCase();
  return snap.docs
    .map((d) => toInstrument(d.id, d.data() as Record<string, unknown>))
    .filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q)
    );
}

export async function updateEloRating(id: string, newRating: number): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    eloRating: newRating,
    updatedAt: serverTimestamp(),
  });
}
