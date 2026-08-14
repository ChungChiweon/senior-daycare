import OpenAI from "openai";
import type { AiProvider } from "@/lib/ai/types";
import type { GeneratedContent } from "@/types/content";
import { mockProvider } from "@/lib/ai/mock-provider";
import { SOCIAL_WORK_SYSTEM_INSTRUCTION, validateSocialWorkOutput } from "@/lib/ai/social-work-guardrails";

export const openAiProvider: AiProvider = {
  async generate(input) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return mockProvider.generate(input);
    }

    const model = process.env.AI_MODEL || process.env.OPENAI_MODEL || "gpt-5.4-mini";

    try {
      const client = new OpenAI({ apiKey });
      const response = await client.chat.completions.create({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${SOCIAL_WORK_SYSTEM_INSTRUCTION}\nReturn only a valid JSON object with title, body, sections[{label,value}], and optional hashtags[].`
          },
          {
            role: "user",
            content: JSON.stringify({
              contentType: input.type,
              keywords: input.keywords,
              memo: input.memo,
              institution: input.institution,
              activityName: input.activityName,
              className: input.className,
              ageGroup: input.ageGroup,
              activityDate: input.activityDate,
              tone: input.tone,
              analyzePhotos: input.analyzePhotos,
              imageCount: input.images.length,
              imageUrls: input.images.map((image) => image.url)
            })
          }
        ]
      });

      const raw = response.choices[0]?.message.content ?? "{}";
      const parsed = JSON.parse(raw) as GeneratedContent;

      const validation = validateSocialWorkOutput(parsed.body || "");
      if (!validation.isValid) {
        return mockProvider.generate(input);
      }

      return parsed;
    } catch {
      return mockProvider.generate(input);
    }
  }
};
