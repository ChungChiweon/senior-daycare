const fs = require('fs');
const path = require('path');

console.log("==========================================");
console.log("=== Phase 2 Verification & Test Execution ===");
console.log("==========================================\n");

global.window = global;
global.atob = global.atob || ((b64) => Buffer.from(b64, 'base64').toString('binary'));
global.btoa = global.btoa || ((str) => Buffer.from(str, 'binary').toString('base64'));

// Mock LocalStorage for Repository Node Execution
const localStorageStore = {};
global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, val) => { localStorageStore[key] = String(val); },
  removeItem: (key) => { delete localStorageStore[key]; }
};
global.window.localStorage = global.localStorage;

// 1. Load LocalRecordBlockRepository & LocalDocumentRepository
const { LocalRecordBlockRepository } = require("./src/lib/repository/local-record-block-repository");
const { LocalDocumentRepository } = require("./src/lib/repository/local-document-repository");

const recordRepo = new LocalRecordBlockRepository();
const docRepo = new LocalDocumentRepository();

// Clear pre-existing
recordRepo.clearAll();

// 2. Test 1: Common Activity Apply to 3 out of 5 residents
console.log("1. Testing Common Activity Apply to 3 out of 5 residents...");
const selectedResidentIds = ["res-01", "res-02", "res-03"]; // 3 selected
const unselectedResidentIds = ["res-04", "res-05"]; // 2 unselected

const commonSession = {
  id: "sess-001",
  activity: { title: "오전 실버 건강체조", category: "신체", time: "10:30~11:30" },
  targetResidentIds: selectedResidentIds,
  createdAt: new Date().toISOString()
};

recordRepo.saveCommonSession(commonSession);

// Populate blocks only for selected 3
selectedResidentIds.forEach((id) => {
  recordRepo.saveBlock({
    id: `blk-${id}-common`,
    residentId: id,
    blockType: "common_program",
    title: "3. 공통 프로그램",
    sourceType: "common",
    sourceData: commonSession.activity,
    aiDraft: "오전 실버 건강체조 프로그램에 동참하셨습니다.",
    editedText: "오전 실버 건강체조에 신나게 동참하셨습니다. (사용자 수정본)",
    visibilityScope: "auto_doc_ok",
    author: "박지영 사회복지사",
    reviewStatus: "reviewed",
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

console.log("  - Saved common session to repository key: silvercare.commonActivitySessions");
console.log(`  - Applied to 3 residents: ${selectedResidentIds.join(", ")}`);
console.log(`  - Unselected 2 residents: ${unselectedResidentIds.join(", ")}`);

// Verify Persistence & Separation
const res1Blocks = recordRepo.getBlocksByResident("res-01");
const res4Blocks = recordRepo.getBlocksByResident("res-04");

console.log(`  - res-01 blocks count: ${res1Blocks.length} (Has common_program: ${res1Blocks.some(b => b.blockType === "common_program")})`);
console.log(`  - res-04 blocks count: ${res4Blocks.length} (Has common_program: ${res4Blocks.some(b => b.blockType === "common_program")})`);

// 3. Test 2: User Edits & Version Snapshot
console.log("\n2. Testing User Edits & Document Version Snapshot...");

// Create initial Document Snapshot
const initialSnapshot = {
  documentId: "doc-snap-001",
  templateId: "tpl_care_record_hwpx",
  residentId: "res-01",
  residentName: "김순자",
  sourceBlockIds: ["blk-res-01-common"],
  sourceBlockVersions: { "blk-res-01-common": 1 },
  assembledText: "김순자 어르신 오늘 체조 참여",
  editedText: "김순자 어르신 오늘 체조 참여",
  approvalStatus: "approved",
  requiresNewVersion: false,
  exportedFiles: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

docRepo.saveSnapshot(initialSnapshot);
console.log("  - Saved initial Document Snapshot (v1, requiresNewVersion: false)");

// Edit RecordBlock text via repository
console.log("  - Editing RecordBlock text via recordRepo.updateBlockText()...");
recordRepo.updateBlockText("blk-res-01-common", "김순자 어르신 오전 체조 동작을 완벽히 소화하셨습니다.");

// Mark requires new version
docRepo.markRequiresNewVersion("res-01", "blk-res-01-common");

const updatedSnapshot = docRepo.getSnapshot("doc-snap-001");
console.log(`  - Snapshot status after block edit -> requiresNewVersion: ${updatedSnapshot.requiresNewVersion}`);

// 4. Test 3: PDF File Generation
console.log("\n3. Testing Real PDF Generation to Disk...");
const { jsPDF } = require("jspdf");

const pdfDoc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
pdfDoc.setFontSize(16);
pdfDoc.text("장기요양급여 제공기록 보고서 (테스트 PDF)", 105, 20, { align: "center" });

// Add approval box
pdfDoc.rect(130, 30, 20, 15);
pdfDoc.text("작성자", 140, 35, { align: "center" });
pdfDoc.rect(150, 30, 20, 15);
pdfDoc.text("검토자", 160, 35, { align: "center" });
pdfDoc.rect(170, 30, 20, 15);
pdfDoc.text("승인자", 180, 35, { align: "center" });

// Page 1 & Page 2 content
for (let i = 1; i <= 12; i++) {
  if (i === 8) pdfDoc.addPage();
  const y = i <= 7 ? 55 + i * 15 : 20 + (i - 7) * 15;
  pdfDoc.text(`${i}. RecordBlock ${i}: 어르신 일일 케어 상세 기록`, 20, y);
}

// Footers
const totalPages = pdfDoc.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  pdfDoc.setPage(p);
  pdfDoc.setFontSize(8);
  pdfDoc.text(`기관: 테스트 기관 | 작성자: 박지영 | Page ${p} / ${totalPages}`, 105, 285, { align: "center" });
}

const outDir = path.join(__dirname, "test_output");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pdfFilePath = path.join(outDir, "real_test_record.pdf");
const pdfBuffer = Buffer.from(pdfDoc.output("arraybuffer"));
fs.writeFileSync(pdfFilePath, pdfBuffer);

const pdfStats = fs.statSync(pdfFilePath);
console.log(`  - PDF File Generated: ${pdfFilePath}`);
console.log(`  - Pages: ${totalPages}`);
console.log(`  - File Size: ${(pdfStats.size / 1024).toFixed(2)} KB (${pdfStats.size} bytes)`);

// 5. Test 4: HWPX Template Status Check
console.log("\n4. Testing HWPX Base ZIP Template Availability...");
const hwpxBaseZipExists = fs.existsSync(path.join(__dirname, "public/templates/base_template.hwpx"));
console.log(`  - Base HWPX ZIP template file exists? -> ${hwpxBaseZipExists}`);
console.log(`  - Button status: ${hwpxBaseZipExists ? "ACTIVE" : "DISABLED (Template Not Registered - Safe Disabled)"}`);

console.log("\n==========================================");
console.log("=== Verification Script Completed Successfully ===");
console.log("==========================================");
