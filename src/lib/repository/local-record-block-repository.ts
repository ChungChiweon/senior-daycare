import type { CommonActivity, IndividualCare, IndividualResponse } from "@/types/integrated-care";
import type { RecordBlock, VisibilityScope } from "@/types/record-block";
import type { CommonSession, RecordBlockRepository } from "./record-block-repository";
import type { FieldRecord } from "@/components/content/MobileFieldLogger";

const KEYS = {
  RECORD_BLOCKS: "silvercare.recordBlocks",
  COMMON_SESSIONS: "silvercare.commonActivitySessions",
  INDIVIDUAL_CARES: "silvercare.individualCARES",
  INDIVIDUAL_RESPONSES: "silvercare.individualResponses",
  FIELD_RECORDS: "silvercare.fieldRecords"
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage [${key}]`, err);
  }
}

export class LocalRecordBlockRepository implements RecordBlockRepository {
  getBlocksByResident(residentId: string): RecordBlock[] {
    const allBlocks = readStorage<RecordBlock[]>(KEYS.RECORD_BLOCKS, []);
    return allBlocks.filter((b) => b.residentId === residentId);
  }

  saveBlock(block: RecordBlock): void {
    const allBlocks = readStorage<RecordBlock[]>(KEYS.RECORD_BLOCKS, []);
    const idx = allBlocks.findIndex((b) => b.id === block.id);
    if (idx >= 0) {
      allBlocks[idx] = block;
    } else {
      allBlocks.push(block);
    }
    writeStorage(KEYS.RECORD_BLOCKS, allBlocks);
  }

  saveBlocks(blocks: RecordBlock[]): void {
    const allBlocks = readStorage<RecordBlock[]>(KEYS.RECORD_BLOCKS, []);
    const map = new Map(allBlocks.map((b) => [b.id, b]));
    blocks.forEach((b) => map.set(b.id, b));
    writeStorage(KEYS.RECORD_BLOCKS, Array.from(map.values()));
  }

  saveFieldRecord(record: FieldRecord): void {
    const list = readStorage<FieldRecord[]>(KEYS.FIELD_RECORDS, []);
    list.unshift(record);
    writeStorage(KEYS.FIELD_RECORDS, list);

    // Convert FieldRecord into a formal RecordBlock (special_notes) and persist
    const newBlock: RecordBlock = {
      id: record.id,
      residentId: record.residentId,
      title: `📱 외근/현장 케어 (${record.category})`,
      sourceType: "individual",
      blockType: "special_notes",
      sourceData: {
        category: record.category,
        location: record.location,
        note: record.note,
        actionsTaken: record.actionsTaken,
        timeStr: record.timeStr
      },
      aiDraft: `[📱 외근/현장 케어] ${record.residentName} 어르신 (${record.timeStr}): ${record.location} - ${record.note} (조치: ${record.actionsTaken})`,
      editedText: `[📱 외근/현장 케어] ${record.residentName} 어르신 (${record.timeStr}): ${record.location} - ${record.note} (조치: ${record.actionsTaken})`,
      visibilityScope: "guardian_ok",
      author: "모바일 현장 사회복지사",
      reviewStatus: "approved",
      version: 1,
      createdAt: record.createdAt,
      updatedAt: record.createdAt
    } as RecordBlock;

    this.saveBlock(newBlock);
  }

  getFieldRecords(): FieldRecord[] {
    return readStorage<FieldRecord[]>(KEYS.FIELD_RECORDS, []);
  }

  updateBlockText(blockId: string, editedText: string): RecordBlock | null {
    const allBlocks = readStorage<RecordBlock[]>(KEYS.RECORD_BLOCKS, []);
    const idx = allBlocks.findIndex((b) => b.id === blockId);
    if (idx < 0) return null;

    const updated: RecordBlock = {
      ...allBlocks[idx],
      editedText,
      version: allBlocks[idx].version + 1,
      updatedAt: new Date().toISOString()
    };
    allBlocks[idx] = updated;
    writeStorage(KEYS.RECORD_BLOCKS, allBlocks);
    return updated;
  }

  updateBlockScope(blockId: string, scope: VisibilityScope): RecordBlock | null {
    const allBlocks = readStorage<RecordBlock[]>(KEYS.RECORD_BLOCKS, []);
    const idx = allBlocks.findIndex((b) => b.id === blockId);
    if (idx < 0) return null;

    const updated: RecordBlock = {
      ...allBlocks[idx],
      visibilityScope: scope,
      updatedAt: new Date().toISOString()
    };
    allBlocks[idx] = updated;
    writeStorage(KEYS.RECORD_BLOCKS, allBlocks);
    return updated;
  }

  approveBlock(blockId: string): RecordBlock | null {
    const allBlocks = readStorage<RecordBlock[]>(KEYS.RECORD_BLOCKS, []);
    const idx = allBlocks.findIndex((b) => b.id === blockId);
    if (idx < 0) return null;

    const updated: RecordBlock = {
      ...allBlocks[idx],
      reviewStatus: "approved",
      updatedAt: new Date().toISOString()
    };
    allBlocks[idx] = updated;
    writeStorage(KEYS.RECORD_BLOCKS, allBlocks);
    return updated;
  }

  saveCommonSession(session: CommonSession): void {
    const sessions = readStorage<CommonSession[]>(KEYS.COMMON_SESSIONS, []);
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.push(session);
    }
    writeStorage(KEYS.COMMON_SESSIONS, sessions);
  }

  getCommonSessions(): CommonSession[] {
    return readStorage<CommonSession[]>(KEYS.COMMON_SESSIONS, []);
  }

  saveIndividualCare(care: IndividualCare): void {
    const map = readStorage<Record<string, IndividualCare>>(KEYS.INDIVIDUAL_CARES, {});
    map[care.residentId] = care;
    writeStorage(KEYS.INDIVIDUAL_CARES, map);
  }

  getIndividualCare(residentId: string): IndividualCare | null {
    const map = readStorage<Record<string, IndividualCare>>(KEYS.INDIVIDUAL_CARES, {});
    return map[residentId] || null;
  }

  saveIndividualResponse(response: IndividualResponse): void {
    const map = readStorage<Record<string, IndividualResponse>>(KEYS.INDIVIDUAL_RESPONSES, {});
    map[response.residentId] = response;
    writeStorage(KEYS.INDIVIDUAL_RESPONSES, map);
  }

  getIndividualResponse(residentId: string): IndividualResponse | null {
    const map = readStorage<Record<string, IndividualResponse>>(KEYS.INDIVIDUAL_RESPONSES, {});
    return map[residentId] || null;
  }

  clearAll(): void {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  }
}

export const localRecordBlockRepository = new LocalRecordBlockRepository();
