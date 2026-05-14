export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export async function searchInstrumentUrls(query: string): Promise<TavilyResult[]> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: `${query} instrumento musical precio especificaciones tienda`,
      search_depth: "basic",
      max_results: 10,
      include_domains: ["thomann.de", "musicstore.de", "amazon.es", "reverb.com", "sweetwater.com"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily error: ${response.status}`);
  }

  const data = await response.json() as { results: TavilyResult[] };
  return data.results;
}
