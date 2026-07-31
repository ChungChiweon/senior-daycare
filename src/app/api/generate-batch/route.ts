import { NextResponse } from "next/server";
import { TWENTY_DOCUMENT_TYPES } from "@/data/twenty-document-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { residentName = "김순자", activityDate = new Date().toLocaleDateString("ko-KR"), docId } = body;

    // Simulate AI model inference processing (e.g., Gemini / HuggingFace free tier)
    if (docId) {
      const docInfo = TWENTY_DOCUMENT_TYPES.find((d) => d.id === docId);
      if (!docInfo) {
        return NextResponse.json({ error: "Document type not found" }, { status: 400 });
      }
      const generatedText = docInfo.defaultDraftGenerator(residentName, activityDate);
      return NextResponse.json({
        docId,
        text: generatedText,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      });
    }

    // Batch generate all 20 documents
    const results: Record<string, { text: string; timestamp: string }> = {};
    const timestamp = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    TWENTY_DOCUMENT_TYPES.forEach((docInfo) => {
      results[docInfo.id] = {
        text: docInfo.defaultDraftGenerator(residentName, activityDate),
        timestamp
      };
    });

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Batch AI generation error:", err);
    return NextResponse.json({ error: "AI Generation failed" }, { status: 500 });
  }
}
