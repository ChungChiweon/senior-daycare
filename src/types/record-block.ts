export type BlockType =
  | "attendance_transport"
  | "health_vitals"
  | "meal_hydration"
  | "medication"
  | "elimination"
  | "rest_sleep"
  | "common_program"
  | "individual_participation"
  | "emotion_behavior_cognition"
  | "special_notes"
  | "actions_taken"
  | "guardian_message";

export type SourceType = "common" | "individual";

export type VisibilityScope = "internal_only" | "guardian_ok" | "auto_doc_ok" | "promo_ok" | "consent_needed";

export type ReviewStatus = "unreviewed" | "reviewed" | "approved";

export type RecordBlock = {
  id: string;
  residentId: string;
  blockType: BlockType;
  title: string;
  sourceType: SourceType;
  sourceData: Record<string, unknown>;
  aiDraft: string;
  editedText: string;
  visibilityScope: VisibilityScope;
  author: string;
  reviewStatus: ReviewStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type DocumentCategory = "guardian" | "internal" | "program" | "promo";

export type DocumentTemplate = {
  id: string;
  title: string;
  category: DocumentCategory;
  categoryLabel: string;
  isInternal: boolean;
  blockOrder: BlockType[];
  toneStyle: "warm" | "formal_legal" | "concise" | "promo";
  hwpxTemplateName: string;
};

export type ExportMetadata = {
  author: string;
  reviewer: string;
  approver: string;
  version: number;
  exportedAt: string;
  documentTitle: string;
  residentName: string;
};

export type BlockDiffModalData = {
  blockId: string;
  title: string;
  currentText: string;
  newAiDraft: string;
};
