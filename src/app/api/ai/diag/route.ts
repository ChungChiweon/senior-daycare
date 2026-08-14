/**
 * gpt-5-mini Responses API Deep Diagnostic — Staging Only
 * Tests reasoning effort × max_output_tokens combinations.
 * Never exposes API key or personal data.
 *
 * ReasoningEffort valid values (SDK 4.104+): 'low' | 'medium' | 'high' | null
 * Note: 'minimal' is NOT a valid value in this SDK version.
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";


type ReasoningEffortVal = "low" | "medium" | "high";

type DiagRow = {
  label: string;
  model: string | null;
  status: string | null;
  incomplete_reason: string | null;
  output_items: number;
  output_types: string[];
  content_types: string[];
  visible_text: string | null;
  visible_text_len: number;
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  error: string | null;
  latency_ms: number;
};

/** Safely extract visible text from output array — never uses output_text getter */
function extractText(output: OpenAI.Responses.ResponseOutputItem[] | undefined): string {
  if (!output) return "";
  const parts: string[] = [];
  for (const item of output) {
    if (item.type === "message") {
      for (const c of item.content ?? []) {
        if (c.type === "output_text" && c.text) parts.push(c.text);
      }
    }
  }
  return parts.join("");
}

function outputTypes(output: OpenAI.Responses.ResponseOutputItem[] | undefined): string[] {
  return (output ?? []).map((i) => i.type);
}

function contentTypes(output: OpenAI.Responses.ResponseOutputItem[] | undefined): string[] {
  const types: string[] = [];
  for (const item of output ?? []) {
    if (item.type === "message") {
      for (const c of item.content ?? []) types.push(c.type);
    }
  }
  return types;
}

async function probe(
  client: OpenAI,
  label: string,
  model: string,
  input: string,
  maxTokens: number,
  reasoningEffort?: ReasoningEffortVal
): Promise<DiagRow> {
  const start = Date.now();
  try {
    const reasoningParam = reasoningEffort
      ? { effort: reasoningEffort as "low" | "medium" | "high" }
      : undefined;

    const r = await client.responses.create({
      model,
      store: false,
      input,
      max_output_tokens: maxTokens,
      ...(reasoningParam ? { reasoning: reasoningParam } : {})
    });

    const visibleText = extractText(r.output);
    const latency = Date.now() - start;
    const reasoningTokens =
      (r.usage?.output_tokens_details as { reasoning_tokens?: number } | undefined)
        ?.reasoning_tokens ?? 0;

    return {
      label,
      model: r.model ?? null,
      status: r.status ?? null,
      incomplete_reason:
        r.status === "incomplete" ? (r.incomplete_details?.reason ?? "unknown") : null,
      output_items: r.output?.length ?? 0,
      output_types: outputTypes(r.output),
      content_types: contentTypes(r.output),
      visible_text: visibleText || null,
      visible_text_len: visibleText.length,
      input_tokens: r.usage?.input_tokens ?? 0,
      output_tokens: r.usage?.output_tokens ?? 0,
      reasoning_tokens: reasoningTokens,
      error: null,
      latency_ms: latency
    };
  } catch (e: unknown) {
    const latency = Date.now() - start;
    let errMsg = "unknown";
    if (e instanceof OpenAI.APIError) {
      errMsg = `status=${e.status} type=${e.type} msg=${e.message.slice(0, 150)}`;
    } else if (e instanceof Error) {
      errMsg = e.message.slice(0, 150);
    }
    return {
      label,
      model: null,
      status: "error",
      incomplete_reason: null,
      output_items: 0,
      output_types: [],
      content_types: [],
      visible_text: null,
      visible_text_len: 0,
      input_tokens: 0,
      output_tokens: 0,
      reasoning_tokens: 0,
      error: errMsg,
      latency_ms: latency
    };
  }
}

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim().length < 10) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: apiKey.trim() });
  const model = process.env.AI_MODEL ?? "gpt-5-mini";
  const SIMPLE_PROMPT = "Reply exactly with: OK";
  const JSON_PROMPT = 'Return only this JSON, no other text: {"ok": true}';

  const results: DiagRow[] = [];

  // ── Phase 1: max_output_tokens sweep @ effort=low ──────────────────────
  for (const tok of [128, 256, 512, 1024]) {
    results.push(await probe(client, `tokens=${tok} effort=low`, model, SIMPLE_PROMPT, tok, "low"));
  }

  // ── Phase 2: effort sweep @ tokens=512 ────────────────────────────────
  for (const effort of ["medium", "high"] as const) {
    results.push(await probe(client, `tokens=512 effort=${effort}`, model, SIMPLE_PROMPT, 512, effort));
  }

  // ── Phase 3: no reasoning param @ tokens=512 ──────────────────────────
  results.push(await probe(client, "tokens=512 no_reasoning_param", model, SIMPLE_PROMPT, 512, undefined));

  // ── Phase 4: JSON test with best config ───────────────────────────────
  const bestVisible = results.find((r) => r.visible_text_len > 0);
  let jsonRow: (DiagRow & { json_parsed?: boolean; json_parse_error?: string | null }) | null = null;

  if (bestVisible) {
    const effort = bestVisible.label.includes("low")
      ? "low"
      : bestVisible.label.includes("medium")
      ? "medium"
      : bestVisible.label.includes("high")
      ? "high"
      : undefined;

    const bestTokens = Math.max(512, bestVisible.input_tokens + bestVisible.output_tokens);
    const jr = await probe(client, "json_test", model, JSON_PROMPT, bestTokens, effort as ReasoningEffortVal | undefined);
    let jsonParsed = false;
    let jsonParseError: string | null = null;
    if (jr.visible_text) {
      try {
        JSON.parse(jr.visible_text);
        jsonParsed = true;
      } catch (e) {
        jsonParseError = e instanceof Error ? e.message.slice(0, 80) : "parse error";
      }
    }
    jsonRow = { ...jr, json_parsed: jsonParsed, json_parse_error: jsonParseError };
  }

  // ── Summary ────────────────────────────────────────────────────────────
  const anyVisible = results.some((r) => r.visible_text_len > 0);
  const bestConfig = results.find((r) => r.visible_text_len > 0);

  return NextResponse.json(
    {
      model_queried: model,
      timestamp: new Date().toISOString(),
      summary: {
        model_exists: true,
        connectivity: results[0]?.status !== "error",
        any_visible_output: anyVisible,
        best_config: bestConfig
          ? {
              label: bestConfig.label,
              visible_len: bestConfig.visible_text_len,
              visible_text_preview: bestConfig.visible_text?.slice(0, 80),
              reasoning_tokens: bestConfig.reasoning_tokens,
              output_tokens: bestConfig.output_tokens,
              latency_ms: bestConfig.latency_ms
            }
          : null,
        need_model_switch: !anyVisible
      },
      phase1_tokens_sweep: results.slice(0, 4),
      phase2_effort_sweep: results.slice(4, 6),
      phase3_no_param: results[6],
      phase4_json_test: jsonRow
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
