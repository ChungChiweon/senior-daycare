export type DocumentSnapshot = {
  documentId: string;
  templateId: string;
  residentId: string;
  residentName: string;
  sourceBlockIds: string[];
  sourceBlockVersions: Record<string, number>;
  assembledText: string;
  editedText: string;
  approvalStatus: "unreviewed" | "reviewed" | "approved";
  requiresNewVersion: boolean;
  exportedFiles: { type: "pdf" | "hwpx"; filename: string; exportedAt: string }[];
  createdAt: string;
  updatedAt: string;
};

export interface DocumentRepository {
  getSnapshot(documentId: string): DocumentSnapshot | null;
  getSnapshotsByResident(residentId: string): DocumentSnapshot[];
  saveSnapshot(snapshot: DocumentSnapshot): void;
  markRequiresNewVersion(residentId: string, updatedBlockId: string): void;
  getAllSnapshots(): DocumentSnapshot[];
}
