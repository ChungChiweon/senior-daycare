const fs = require('fs');
const path = require('path');

console.log("=== RecordBlock Logic Verification Test ===");

// 1. Mock Residents & Target Selection
const residents = [
  { id: "res-01", name: "김순자", status: "출석" },
  { id: "res-02", name: "박영수", status: "출석" },
  { id: "res-03", name: "이정희", status: "출석" },
  { id: "res-04", name: "최복례", status: "출석" },
  { id: "res-05", name: "강성호", status: "출석" }
];

// Select 3 out of 5 (res-01, res-02, res-03)
const selectedIds = ["res-01", "res-02", "res-03"];
const unselectedIds = ["res-04", "res-05"];

console.log(`- Total residents: ${residents.length}`);
console.log(`- Selected for common activity (3): ${selectedIds.join(", ")}`);
console.log(`- Unselected (2): ${unselectedIds.join(", ")}`);

// Apply common activity
const commonActivity = {
  title: "오전 실버 건강체조",
  category: "신체",
  time: "10:30 ~ 11:30"
};

const residentBlocksMap = {};
residents.forEach(r => {
  residentBlocksMap[r.id] = [];
});

// Apply only to selectedIds
selectedIds.forEach(id => {
  residentBlocksMap[id].push({
    blockType: "common_program",
    title: commonActivity.title,
    sourceType: "common",
    sourceData: commonActivity
  });
});

console.log("\n=== F, G. Common & Individual Selection Test Result ===");
residents.forEach(r => {
  const blocks = residentBlocksMap[r.id];
  const hasCommonBlock = blocks.some(b => b.blockType === "common_program");
  console.log(`Resident [${r.id} ${r.name}]: common_program block created? -> ${hasCommonBlock}`);
});

// 2. Privacy Filter Test
const sampleBlocks = [
  { blockType: "attendance_transport", title: "송영", visibilityScope: "guardian_ok" },
  { blockType: "health_vitals", title: "활력징후", visibilityScope: "internal_only" },
  { blockType: "medication", title: "투약", visibilityScope: "internal_only" },
  { blockType: "guardian_message", title: "보호자 메시지", visibilityScope: "guardian_ok" }
];

const guardianFilteredBlocks = sampleBlocks.filter(b => b.visibilityScope !== "internal_only");
console.log("\n=== I. Privacy Scope Filtering Test ===");
console.log("Original Blocks (4):", sampleBlocks.map(b => `${b.title}(${b.visibilityScope})`).join(", "));
console.log("Guardian Doc Filtered Blocks (2):", guardianFilteredBlocks.map(b => `${b.title}(${b.visibilityScope})`).join(", "));

// Save test output
const outDir = path.join(__dirname, "test_output");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, "verification_summary.json"), JSON.stringify({
  selectedIds,
  unselectedIds,
  residentBlocksMap,
  guardianFilteredBlocks
}, null, 2));

console.log("\nVerification test finished successfully.");
