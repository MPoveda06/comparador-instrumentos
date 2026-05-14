import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const instruments = [
  {
    name: 'Fender Stratocaster American Professional II',
    brand: 'Fender', category: 'guitar', price: 1899, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
    specs: { cuerpo: 'Aliso', mastil: 'Arce', pastillas: 'V-Mod II Single-Coil', trastes: '22' },
    sourceUrl: 'https://www.thomann.de', store: 'Thomann', eloRating: 1120,
  },
  {
    name: 'Gibson Les Paul Standard 60s',
    brand: 'Gibson', category: 'guitar', price: 2499, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400',
    specs: { cuerpo: 'Caoba', mastil: 'Caoba', pastillas: 'Burstbucker', trastes: '22' },
    sourceUrl: 'https://www.thomann.de', store: 'Thomann', eloRating: 1150,
  },
  {
    name: 'Roland TD-17KVX V-Drums',
    brand: 'Roland', category: 'drums', price: 1699, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400',
    specs: { platillos: '3 x CY series', bombo: 'KD-10', modulo: 'TD-17' },
    sourceUrl: 'https://www.musicstore.com', store: 'Music Store', eloRating: 1080,
  },
  {
    name: 'Yamaha P-125 Digital Piano',
    brand: 'Yamaha', category: 'keyboard', price: 649, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
    specs: { teclas: '88 GHC', polifonía: '192 voces', sonidos: '24' },
    sourceUrl: 'https://www.amazon.es', store: 'Amazon', eloRating: 1050,
  },
  {
    name: 'Shure SM58 Vocal Dynamic Microphone',
    brand: 'Shure', category: 'other', price: 99, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400',
    specs: { tipo: 'Dinámico', patron: 'Cardioide', frecuencia: '50-15000 Hz' },
    sourceUrl: 'https://www.sweetwater.com', store: 'Sweetwater', eloRating: 1200,
  },
  {
    name: 'Fender Player Jazz Bass',
    brand: 'Fender', category: 'bass', price: 799, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=400',
    specs: { cuerpo: 'Aliso', mastil: 'Arce', pastillas: 'Player Series Alnico 5', cuerdas: '4' },
    sourceUrl: 'https://www.thomann.de', store: 'Thomann', eloRating: 1030,
  },
  {
    name: 'Korg Minilogue XD Polyphonic Analogue Synthesizer',
    brand: 'Korg', category: 'keyboard', price: 579, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=400',
    specs: { voces: '4', osciladores: 'Multi Engine + 2 VCO', filtro: 'Low-pass', efectos: 'Delay, Reverb, Chorus' },
    sourceUrl: 'https://www.thomann.de', store: 'Thomann', eloRating: 1070,
  },
  {
    name: 'Audio-Technica ATH-M50x Professional Headphones',
    brand: 'Audio-Technica', category: 'other', price: 149, currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    specs: { tipo: 'Circumaural', respuesta: '15-28000 Hz', impedancia: '38 Ohms', drivers: '45mm' },
    sourceUrl: 'https://www.amazon.es', store: 'Amazon', eloRating: 1090,
  },
];

async function seed() {
  console.log('🌱 Seeding Firestore...');
  for (const inst of instruments) {
    const now = new Date().toISOString();
    await db.collection('instruments').add({ ...inst, createdAt: now, updatedAt: now });
    console.log(`  ✓ ${inst.name}`);
  }
  console.log('✅ Done!');
  process.exit(0);
}

seed().catch(console.error);
