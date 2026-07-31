import type { CommonActivity, IndividualCare, IndividualResponse } from "@/types/integrated-care";
import type { RecordBlock, VisibilityScope } from "@/types/record-block";

export type CommonSession = {
  id: string;
  activity: CommonActivity;
  targetResidentIds: string[];
  createdAt: string;
};

export interface RecordBlockRepository {
  getBlocksByResident(residentId: string): RecordBlock[];
  saveBlock(block: RecordBlock): void;
  saveBlocks(blocks: RecordBlock[]): void;
  updateBlockText(blockId: string, editedText: string): RecordBlock | null;
  updateBlockScope(blockId: string, scope: VisibilityScope): RecordBlock | null;
  approveBlock(blockId: string): RecordBlock | null;

  saveCommonSession(session: CommonSession): void;
  getCommonSessions(): CommonSession[];

  saveIndividualCare(care: IndividualCare): void;
  getIndividualCare(residentId: string): IndividualCare | null;

  saveIndividualResponse(response: IndividualResponse): void;
  getIndividualResponse(residentId: string): IndividualResponse | null;

  clearAll(): void;
}
