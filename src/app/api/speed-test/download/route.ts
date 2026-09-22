export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const requestedSize = Number(searchParams.get("size"));
  const size = Number.isFinite(requestedSize)
    ? Math.min(Math.max(Math.floor(requestedSize), 1_000_000), 10_000_000)
    : 5_000_000;

  const data = new Uint8Array(size);

  for (let i = 0; i < data.length; i++) {
    data[i] = i % 251;
  }

  return new Response(data.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}