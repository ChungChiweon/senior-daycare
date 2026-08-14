import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGuardianNoticeLLM } from "@/lib/ai/openai-client";

const schema = z.object({
  organizationId: z.string().optional(),
  residentId: z.string(),
  residentName: z.string(),
  guardianName: z.string().optional(),
  mealStatus: z.string().default("전량 섭취"),
  medicationStatus: z.string().default("지정 투약 완료"),
  bloodPressure: z.string().default("120/80"),
  temperature: z.string().default("36.5℃"),
  activityName: z.string().optional(),
  cautionNotes: z.string().optional(),
  activityDate: z.string().default(new Date().toISOString().split("T")[0]),
  institutionName: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = schema.parse(body);

    const result = await generateGuardianNoticeLLM(input);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid request schema";
    return NextResponse.json(
      { error: errorMsg, generation_mode: "deterministic_fallback" },
      { status: 400 }
    );
  }
}
