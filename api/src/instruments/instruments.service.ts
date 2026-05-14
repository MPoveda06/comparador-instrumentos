import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Instrument, CreateInstrumentDto } from './instrument.types';

const COLLECTION = 'instruments';

@Injectable()
export class InstrumentsService {
  constructor(private firebase: FirebaseService) {}

  private get db() {
    return this.firebase.getFirestore();
  }

  async create(dto: CreateInstrumentDto): Promise<Instrument> {
    const now = new Date().toISOString();
    const data = { ...dto, specs: dto.specs ?? {}, eloRating: 1000, createdAt: now, updatedAt: now };
    const ref = await this.db.collection(COLLECTION).add(data);
    return { id: ref.id, ...data } as Instrument;
  }

  async findAll(category?: string): Promise<Instrument[]> {
    let query: FirebaseFirestore.Query = this.db.collection(COLLECTION).orderBy('eloRating', 'desc').limit(50);
    if (category) query = query.where('category', '==', category);
    const snap = await query.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Instrument));
  }

  async findOne(id: string): Promise<Instrument | null> {
    const snap = await this.db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as Instrument;
  }

  async search(q: string): Promise<Instrument[]> {
    const snap = await this.db.collection(COLLECTION).get();
    const lower = q.toLowerCase();
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Instrument))
      .filter(i => i.name.toLowerCase().includes(lower) || i.brand.toLowerCase().includes(lower));
  }

  async updateElo(id: string, eloRating: number): Promise<void> {
    await this.db.collection(COLLECTION).doc(id).update({ eloRating, updatedAt: new Date().toISOString() });
  }
}
