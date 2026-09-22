export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("IP lookup failed.");
    }

    const data = await response.json();

    if (!data?.ip) {
      throw new Error("No IP address returned.");
    }

    return Response.json(
      {
        ip: data.ip,
        network: "",
        org: "",
        city: "",
        region: "",
        country: "",
        countryCode: "",
        timezone: "",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("My IP lookup error:", error);

    return Response.json(
      {
        error: "Could not retrieve your public IP address.",
      },
      { status: 502 },
    );
  }
}