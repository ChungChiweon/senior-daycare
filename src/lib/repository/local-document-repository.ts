import type { DocumentRepository, DocumentSnapshot } from "./document-repository";

const KEYS = {
  SNAPSHOTS: "silvercare.documentVersions",
  DRAFTS: "silvercare.documentDrafts"
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

export class LocalDocumentRepository implements DocumentRepository {
  getSnapshot(documentId: string): DocumentSnapshot | null {
    const all = readStorage<DocumentSnapshot[]>(KEYS.SNAPSHOTS, []);
    return all.find((s) => s.documentId === documentId) || null;
  }

  getSnapshotsByResident(residentId: string): DocumentSnapshot[] {
    const all = readStorage<DocumentSnapshot[]>(KEYS.SNAPSHOTS, []);
    return all.filter((s) => s.residentId === residentId);
  }

  saveSnapshot(snapshot: DocumentSnapshot): void {
    const all = readStorage<DocumentSnapshot[]>(KEYS.SNAPSHOTS, []);
    const idx = all.findIndex((s) => s.documentId === snapshot.documentId);
    if (idx >= 0) {
      all[idx] = snapshot;
    } else {
      all.push(snapshot);
    }
    writeStorage(KEYS.SNAPSHOTS, all);
  }

  markRequiresNewVersion(residentId: string, updatedBlockId: string): void {
    const all = readStorage<DocumentSnapshot[]>(KEYS.SNAPSHOTS, []);
    let modified = false;

    all.forEach((s) => {
      if (s.residentId === residentId && s.sourceBlockIds.includes(updatedBlockId)) {
        s.requiresNewVersion = true;
        s.updatedAt = new Date().toISOString();
        modified = true;
      }
    });

    if (modified) {
      writeStorage(KEYS.SNAPSHOTS, all);
    }
  }

  getAllSnapshots(): DocumentSnapshot[] {
    return readStorage<DocumentSnapshot[]>(KEYS.SNAPSHOTS, []);
  }
}

export const localDocumentRepository = new LocalDocumentRepository();
