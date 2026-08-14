import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDocumentDraftLLM } from "@/lib/ai/openai-client";

const schema = z.object({
  organizationId: z.string().optional(),
  templateId: z.string(),
  templateTitle: z.string(),
  category: z.enum(["guardian", "internal", "program", "operation"]),
  residentId: z.string(),
  residentName: z.string(),
  activityDate: z.string(),
  blocks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      editedText: z.string().optional(),
      aiDraft: z.string().optional()
    })
  ).default([]),
  deterministicSkeleton: z.string()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = schema.parse(body);

    const result = await generateDocumentDraftLLM(input);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid request schema";
    return NextResponse.json(
      { error: errorMsg, generation_mode: "deterministic_fallback" },
      { status: 400 }
    );
  }
}
