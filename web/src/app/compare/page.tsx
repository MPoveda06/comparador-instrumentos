"use client";

import { useState } from "react";

interface Instrument {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  eloRating: number;
}

interface ComparisonResult {
  winner: "a" | "b" | "draw";
  reasoning: string;
  scores: { a: number; b: number };
  recommendation: string;
}

interface CompareResponse {
  comparison: ComparisonResult;
  instruments: { a: Instrument; b: Instrument };
}

export default function ComparePage() {
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare() {
    if (!idA || !idB) {
      setError("Introduce los IDs de los dos instrumentos");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instrumentAId: idA, instrumentBId: idB, context }),
      });
      if (!res.ok) throw new Error("Error en la comparación");
      const data = await res.json() as CompareResponse;
      setResult(data);
    } catch {
      setError("No se pudo completar la comparación. Revisa los IDs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comparador</h1>
        <p className="text-gray-500 mb-8">Compara dos instrumentos y Claude decidirá cuál es mejor.</p>

        <div className="bg-white rounded-xl shadow p-6 space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Instrumento A</label>
              <input
                type="text"
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                placeholder="ej: abc123"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Instrumento B</label>
              <input
                type="text"
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                placeholder="ej: xyz789"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contexto (opcional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="ej: soy principiante buscando mi primera guitarra"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Consultando a Claude..." : "Comparar"}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {result.comparison.winner === "a" ? "🏆" : result.comparison.winner === "b" ? "🥈" : "🤝"}
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  {result.comparison.winner === "draw"
                    ? "Empate"
                    : `Gana: ${result.comparison.winner === "a" ? result.instruments.a.name : result.instruments.b.name}`}
                </p>
                <p className="text-sm text-gray-500">{result.comparison.recommendation}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">{result.comparison.reasoning}</p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {(["a", "b"] as const).map((key) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-sm text-gray-900">{result.instruments[key].name}</p>
                  <p className="text-xs text-gray-500">{result.instruments[key].price} {result.instruments[key].currency}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${result.comparison.scores[key]}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{result.comparison.scores[key]}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">ELO: {result.instruments[key].eloRating}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
