export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await request.arrayBuffer();

    return new Response(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch {
    return new Response("Upload test failed.", {
      status: 400,
    });
  }
}