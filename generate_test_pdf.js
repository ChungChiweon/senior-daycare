const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");

console.log("=== Generating Test PDF File ===");

const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4"
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 15;
let y = margin;

const docTitle = "장기요양급여 제공기록 보고서 (테스트 PDF)";
const residentName = "김순자";
const author = "박지영 사회복지사";
const reviewer = "김철수 팀장";
const approver = "이영희 센터장";
const exportedAt = new Date().toLocaleString("ko-KR");

// Header
doc.setFontSize(18);
doc.text(docTitle, pageWidth / 2, y, { align: "center" });
y += 8;

doc.setFontSize(9);
doc.text(`기관: 행복주간보호센터 | 수급자: ${residentName} | 출력일시: ${exportedAt}`, pageWidth / 2, y, { align: "center" });
y += 6;

doc.line(margin, y, pageWidth - margin, y);
y += 8;

// Approval Sign Box
const boxWidth = 22;
const boxHeight = 16;
const startX = pageWidth - margin - boxWidth * 3;
doc.setFontSize(8);
doc.rect(startX, y, boxWidth, boxHeight);
doc.rect(startX + boxWidth, y, boxWidth, boxHeight);
doc.rect(startX + boxWidth * 2, y, boxWidth, boxHeight);

doc.text("작 성 자", startX + boxWidth / 2, y + 4, { align: "center" });
doc.text(author, startX + boxWidth / 2, y + 12, { align: "center" });
doc.text("검 토 자", startX + boxWidth + boxWidth / 2, y + 4, { align: "center" });
doc.text(reviewer, startX + boxWidth + boxWidth / 2, y + 12, { align: "center" });
doc.text("승 인 자", startX + boxWidth * 2 + boxWidth / 2, y + 4, { align: "center" });
doc.text(approver, startX + boxWidth * 2 + boxWidth / 2, y + 12, { align: "center" });

y += boxHeight + 10;

// Add 12 Sections of detailed content to test multi-page break & page 2 pagination
for (let i = 1; i <= 14; i++) {
  if (y > pageHeight - 35) {
    doc.addPage();
    y = margin;
  }

  doc.setFontSize(11);
  doc.text(`${i}. RecordBlock Section ${i}`, margin, y);
  y += 6;

  doc.setFontSize(9);
  const sampleText = `[RecordBlock ${i}] 어르신 당일 인지 및 신체 재활 활동 수행 기록입니다. 점심 식사를 전량 섭취하셨으며 투약 확인이 완료되었습니다. 활력징후(체온 36.5℃, 혈압 120/80 mmHg) 정상 범위를 유지하고 계시며, 소근육 칠교놀이에 적극 참여하여 우수한 성과를 보였습니다.`;
  const splitText = doc.splitTextToSize(sampleText, pageWidth - margin * 2);
  doc.text(splitText, margin, y);
  y += splitText.length * 5 + 6;
}

// Add Footers to all pages
const totalPages = doc.getNumberOfPages();
for (let page = 1; page <= totalPages; page++) {
  doc.setPage(page);
  doc.setFontSize(8);
  doc.text(`작성자: ${author} | 검토자: ${reviewer} | 승인자: ${approver} | 출력일시: ${exportedAt} | Page ${page} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: "center" });
}

// Save PDF file to test_output folder
const outDir = path.join(__dirname, "test_output");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pdfPath = path.join(outDir, "sample_care_record.pdf");
const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
fs.writeFileSync(pdfPath, pdfBuffer);

const stats = fs.statSync(pdfPath);
console.log("PDF File Generated Successfully!");
console.log(`- Path: ${pdfPath}`);
console.log(`- Total Pages: ${totalPages}`);
console.log(`- File Size: ${(stats.size / 1024).toFixed(2)} KB (${stats.size} bytes)`);
