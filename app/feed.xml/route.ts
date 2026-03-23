const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";

export async function GET() {
  const response = await fetch(`${API_URL}/feed.xml`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return new Response("Feed indisponível", { status: response.status });
  }

  const xml = await response.text();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
