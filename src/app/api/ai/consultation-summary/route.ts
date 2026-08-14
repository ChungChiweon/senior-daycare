import { NextResponse } from "next/server";
import { z } from "zod";
import { generateConsultationSummaryLLM } from "@/lib/ai/openai-client";

const schema = z.object({
  organizationId: z.string().optional(),
  residentId: z.string(),
  residentName: z.string(),
  facts: z.array(
    z.object({
      source_id: z.string(),
      date: z.string(),
      type: z.string(),
      text: z.string()
    })
  ).default([]),
  service_goal: z.string().optional(),
  requested_output: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = schema.parse(body);

    const result = await generateConsultationSummaryLLM(input);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid request schema";
    return NextResponse.json(
      { error: errorMsg, generation_mode: "deterministic_fallback" },
      { status: 400 }
    );
  }
}
