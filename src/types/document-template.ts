import type { BlockType, VisibilityScope } from "@/types/record-block";

export type DocumentCategoryKey = "guardian" | "internal" | "program" | "operation";

export type DocumentAudience = "guardian" | "staff" | "manager" | "public";

export type DocumentAction =
  | "save"
  | "send_kakao"
  | "send_sms"
  | "export_pdf"
  | "export_hwpx"
  | "publish";

export type DocumentTemplateDefinition = {
  id: string;
  category: DocumentCategoryKey;
  categoryLabel: string;
  title: string;
  description: string;
  requiredBlocks: BlockType[];
  optionalBlocks: BlockType[];
  excludedBlocks: BlockType[];
  allowedVisibilityScopes: VisibilityScope[];
  audience: DocumentAudience;
  targetAudienceLabel: string;
  tone: "warm" | "formal_legal" | "concise" | "promo";
  targetLength: "short" | "medium" | "long";
  actions: DocumentAction[];
  hwpxTemplateName: string;
};
