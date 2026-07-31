import { jsPDF } from "jspdf";
import type { ExportMetadata, RecordBlock } from "@/types/record-block";

export function generatePdfDocument(
  docTitle: string,
  blocks: RecordBlock[],
  metadata: ExportMetadata
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Header Title
  doc.setFontSize(18);
  doc.text(docTitle, pageWidth / 2, y, { align: "center" });
  y += 8;

  // Metadata Subheader
  doc.setFontSize(9);
  doc.text(
    `기관: 행복주간보호센터 | 이용자: ${metadata.residentName} | 일자: ${metadata.exportedAt} | v${metadata.version}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 6;

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Approval Box (결재란)
  const boxWidth = 22;
  const boxHeight = 16;
  const startX = pageWidth - margin - boxWidth * 3;
  
  doc.setFontSize(8);
  doc.rect(startX, y, boxWidth, boxHeight);
  doc.rect(startX + boxWidth, y, boxWidth, boxHeight);
  doc.rect(startX + boxWidth * 2, y, boxWidth, boxHeight);

  doc.text("작 성 자", startX + boxWidth / 2, y + 4, { align: "center" });
  doc.text(metadata.author, startX + boxWidth / 2, y + 12, { align: "center" });

  doc.text("검 토 자", startX + boxWidth + boxWidth / 2, y + 4, { align: "center" });
  doc.text(metadata.reviewer, startX + boxWidth + boxWidth / 2, y + 12, { align: "center" });

  doc.text("승 인 자", startX + boxWidth * 2 + boxWidth / 2, y + 4, { align: "center" });
  doc.text(metadata.approver, startX + boxWidth * 2 + boxWidth / 2, y + 12, { align: "center" });

  y += boxHeight + 8;

  // Record Blocks Content
  blocks.forEach((block, idx) => {
    // Page break check (table / section clipping prevention)
    if (y > pageHeight - 30) {
      doc.addPage();
      y = margin;
    }

    const titleText = `${idx + 1}. ${block.title} [${block.sourceType === "common" ? "공통" : "개별"}]`;
    const bodyText = block.editedText || block.aiDraft;

    doc.setFontSize(10);
    doc.text(titleText, margin, y);
    y += 5;

    doc.setFontSize(9);
    const splitLines = doc.splitTextToSize(bodyText, pageWidth - margin * 2);
    doc.text(splitLines, margin, y);

    y += splitLines.length * 4.5 + 4;
  });

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `작성자: ${metadata.author} | 검토자: ${metadata.reviewer} | 승인자: ${metadata.approver} | 출력일시: ${metadata.exportedAt} | 페이지 ${i} / ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  return doc;
}

export function downloadPdfFile(
  filename: string,
  docTitle: string,
  blocks: RecordBlock[],
  metadata: ExportMetadata
) {
  const doc = generatePdfDocument(docTitle, blocks, metadata);
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
