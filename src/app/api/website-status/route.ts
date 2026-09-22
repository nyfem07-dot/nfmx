export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const start = performance.now();

  try {
    const body = await request.json();
    const rawUrl = typeof body.url === "string" ? body.url.trim() : "";

    if (!rawUrl) {
      return Response.json(
        { error: "Please enter a website URL." },
        { status: 400 },
      );
    }

    const url = /^https?:\/\//i.test(rawUrl)
      ? rawUrl
      : `https://${rawUrl}`;

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return Response.json(
        { error: "Please enter a valid website URL." },
        { status: 400 },
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return Response.json(
        { error: "Only HTTP and HTTPS websites are supported." },
        { status: 400 },
      );
    }

    let response: Response;

    try {
      response = await fetch(parsedUrl.toString(), {
        method: "HEAD",
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      response = await fetch(parsedUrl.toString(), {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
    }

    const responseTime = Math.round(performance.now() - start);

    const statusCode = response.status;

    const status =
      statusCode >= 200 && statusCode < 300
        ? "online"
        : statusCode >= 300 && statusCode < 400
          ? "redirected"
          : statusCode >= 400 && statusCode < 500
            ? "client-error"
            : statusCode >= 500
              ? "server-error"
              : "unknown";

    return Response.json({
      url: parsedUrl.toString(),
      statusCode,
      statusText: response.statusText,
      responseTime,
      finalUrl: response.url,
      status,
    });
  } catch (error) {
    const responseTime = Math.round(performance.now() - start);

    return Response.json(
      {
        error:
          error instanceof Error && error.name === "TimeoutError"
            ? "The website took too long to respond."
            : "Could not reach the website.",
        responseTime,
      },
      { status: 502 },
    );
  }
}