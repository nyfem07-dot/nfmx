import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt =
      typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide some text." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.6,
          max_completion_tokens: 2048,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "The AI service could not complete the request.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      text: data.choices?.[0]?.message?.content ?? "",
    });
  } catch (error) {
    console.error("AI route error:", error);

    return NextResponse.json(
      { error: "Something went wrong while processing the request." },
      { status: 500 },
    );
  }
}