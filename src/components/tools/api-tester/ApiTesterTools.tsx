"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Play,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  TextInput,
  Workspace,
} from "../shared";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HeaderRow = {
  id: number;
  key: string;
  value: string;
  enabled: boolean;
};

type ApiResponse = {
  status: number;
  statusText: string;
  duration: number;
  headers: Record<string, string>;
  body: string;
};

function formatJson(text: string) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

function isJson(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

export default function ApiTesterTools() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    {
      id: Date.now(),
      key: "",
      value: "",
      enabled: true,
    },
  ]);

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const bodyRequired = method !== "GET" && method !== "DELETE";

  const responseBody = useMemo(() => {
    if (!response) return "";
    return isJson(response.body)
      ? formatJson(response.body)
      : response.body;
  }, [response]);

  function addHeader() {
    setHeaders((current) => [
      ...current,
      {
        id: Date.now() + current.length,
        key: "",
        value: "",
        enabled: true,
      },
    ]);
  }

  function updateHeader(
    id: number,
    field: keyof HeaderRow,
    value: string | boolean,
  ) {
    setHeaders((current) =>
      current.map((header) =>
        header.id === id
          ? {
              ...header,
              [field]: value,
            }
          : header,
      ),
    );
  }

  function removeHeader(id: number) {
    setHeaders((current) => {
      if (current.length === 1) {
        return [
          {
            id: Date.now(),
            key: "",
            value: "",
            enabled: true,
          },
        ];
      }

      return current.filter((header) => header.id !== id);
    });
  }

  async function sendRequest() {
    setError("");
    setResponse(null);
    setCopied(false);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter an API URL.");
      return;
    }

    let requestUrl = trimmedUrl;

    if (!/^https?:\/\//i.test(requestUrl)) {
      requestUrl = `https://${requestUrl}`;
    }

    try {
      new URL(requestUrl);
    } catch {
      setError("Please enter a valid HTTP or HTTPS URL.");
      return;
    }

    if (bodyRequired && body.trim()) {
      try {
        JSON.parse(body);
      } catch {
        setError("Request body contains invalid JSON.");
        return;
      }
    }

    const requestHeaders: Record<string, string> = {};

    for (const header of headers) {
      const key = header.key.trim();
      const value = header.value.trim();

      if (header.enabled && key && value) {
        requestHeaders[key] = value;
      }
    }

    if (
      bodyRequired &&
      body.trim() &&
      !Object.keys(requestHeaders).some(
        (key) => key.toLowerCase() === "content-type",
      )
    ) {
      requestHeaders["Content-Type"] = "application/json";
    }

    setLoading(true);

    const started = performance.now();

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);

      let fetchResponse: Response;

      try {
        fetchResponse = await fetch(requestUrl, {
          method,
          headers: requestHeaders,
          body: bodyRequired && body.trim() ? body : undefined,
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }

      const duration = Math.round(performance.now() - started);
      const responseText = await fetchResponse.text();

      const responseHeaders: Record<string, string> = {};

      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        duration,
        headers: responseHeaders,
        body: responseText,
      });
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        setError("Request timed out after 15 seconds.");
      } else {
        setError(
          "The request could not be completed. The API may block browser requests with CORS.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMethod("GET");
    setUrl("");
    setBody("");
    setHeaders([
      {
        id: Date.now(),
        key: "",
        value: "",
        enabled: true,
      },
    ]);
    setResponse(null);
    setError("");
    setCopied(false);
  }

  async function copyResponse() {
    if (!responseBody) return;

    try {
      await navigator.clipboard.writeText(responseBody);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Workspace>
      <div className="space-y-6">
        <ResultPanel>
          <div className="space-y-5">
            <div>
              <div className="text-lg font-semibold">Request</div>
              <div className="mt-1 text-sm text-slate-400">
                Send HTTP requests and inspect the response directly in your
                browser.
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-36">
                <select
                  value={method}
                  onChange={(event) =>
                    setMethod(event.target.value as HttpMethod)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/20"
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-slate-900 text-white"
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>

              <div className="flex-1">
                <TextInput
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://api.example.com/data"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void sendRequest();
                    }
                  }}
                />
              </div>

              <PrimaryButton onClick={sendRequest} disabled={loading}>
                <span className="inline-flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {loading ? "Sending..." : "Send"}
                </span>
              </PrimaryButton>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        </ResultPanel>

        <ResultPanel>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Headers</div>
                <div className="mt-1 text-sm text-slate-400">
                  Add optional request headers such as authorization or
                  content type.
                </div>
              </div>

              <SecondaryButton onClick={addHeader}>
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add header
                </span>
              </SecondaryButton>
            </div>

            <div className="space-y-3">
              {headers.map((header) => (
                <div
                  key={header.id}
                  className="grid gap-3 sm:grid-cols-[36px_1fr_1fr_44px]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateHeader(
                        header.id,
                        "enabled",
                        !header.enabled,
                      )
                    }
                    className={`rounded-xl border text-sm transition ${
                      header.enabled
                        ? "border-white/15 bg-white/[0.06] text-white"
                        : "border-white/10 bg-white/[0.02] text-slate-600"
                    }`}
                    aria-label={
                      header.enabled
                        ? "Disable header"
                        : "Enable header"
                    }
                  >
                    ✓
                  </button>

                  <TextInput
                    value={header.key}
                    onChange={(event) =>
                      updateHeader(
                        header.id,
                        "key",
                        event.target.value,
                      )
                    }
                    placeholder="Header name"
                  />

                  <TextInput
                    value={header.value}
                    onChange={(event) =>
                      updateHeader(
                        header.id,
                        "value",
                        event.target.value,
                      )
                    }
                    placeholder="Header value"
                  />

                  <button
                    type="button"
                    onClick={() => removeHeader(header.id)}
                    className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                    aria-label="Remove header"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ResultPanel>

        {bodyRequired && (
          <ResultPanel>
            <div className="space-y-5">
              <div>
                <div className="text-lg font-semibold">Request body</div>
                <div className="mt-1 text-sm text-slate-400">
                  Use JSON for POST, PUT and PATCH requests.
                </div>
              </div>

              <Field label="JSON body">
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={10}
                  spellCheck={false}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-white/20"
                  placeholder={`{
  "name": "NFMX",
  "active": true
}`}
                />
              </Field>
            </div>
          </ResultPanel>
        )}

        {response && (
          <ResultPanel>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">Response</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {response.duration} ms
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SecondaryButton onClick={copyResponse}>
                    <span className="inline-flex items-center gap-2">
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy response"}
                    </span>
                  </SecondaryButton>

                  <SecondaryButton onClick={reset}>
                    <span className="inline-flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Reset
                    </span>
                  </SecondaryButton>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    response.status >= 200 &&
                    response.status < 300
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : response.status >= 400
                        ? "border-red-400/20 bg-red-400/10 text-red-300"
                        : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                  }`}
                >
                  {response.status} {response.statusText}
                </div>

                <div className="text-sm text-slate-500">
                  Response time: {response.duration} ms
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-slate-300">
                  Response body
                </div>

                <pre className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black/30 p-5 font-mono text-xs leading-6 text-slate-200">
                  {responseBody || "Empty response body"}
                </pre>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-slate-300">
                  Response headers
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  {Object.entries(response.headers).length > 0 ? (
                    Object.entries(response.headers).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="grid gap-2 border-b border-white/5 px-4 py-3 last:border-b-0 sm:grid-cols-[220px_1fr]"
                        >
                          <div className="break-all text-xs font-medium text-slate-300">
                            {key}
                          </div>
                          <div className="break-all text-xs text-slate-500">
                            {value}
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="px-4 py-4 text-sm text-slate-500">
                      No response headers were exposed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Requests are sent from your browser. Some APIs may block browser
            access with CORS.
          </div>

          {!response && (
            <SecondaryButton onClick={reset}>
              <span className="inline-flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset
              </span>
            </SecondaryButton>
          )}
        </div>
      </div>
    </Workspace>
  );
}
