import type { ExportMetadata, RecordBlock } from "@/types/record-block";

export function generateHwpxXml(
  docTitle: string,
  blocks: RecordBlock[],
  metadata: ExportMetadata
): string {

  const paragraphsXml = blocks
    .map((block) => {
      const text = block.editedText || block.aiDraft;
      const escapedTitle = escapeXml(block.title);
      const escapedText = escapeXml(text);

      return `
      <hwpx:p id="${block.id}">
        <hwpx:run>
          <hwpx:secPr />
          <hwpx:t style="font-weight:bold; font-size:11pt; color:#003366;">[${escapedTitle}]</hwpx:t>
        </hwpx:run>
      </hwpx:p>
      <hwpx:p>
        <hwpx:run>
          <hwpx:t style="font-size:10pt; line-height:160%;">${escapedText}</hwpx:t>
        </hwpx:run>
      </hwpx:p>
      <hwpx:p><hwpx:run><hwpx:t></hwpx:t></hwpx:run></hwpx:p>`;
    })
    .join("\n");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<hwpx:document xmlns:hwpx="http://www.hancom.co.kr/hwpml/2011/hwpx" version="1.0">
  <hwpx:head>
    <hwpx:docOption>
      <hwpx:linkinfo path="" />
    </hwpx:docOption>
    <hwpx:metadata>
      <hwpx:title>${escapeXml(docTitle)}</hwpx:title>
      <hwpx:author>${escapeXml(metadata.author)}</hwpx:author>
      <hwpx:reviewer>${escapeXml(metadata.reviewer)}</hwpx:reviewer>
      <hwpx:approver>${escapeXml(metadata.approver)}</hwpx:approver>
      <hwpx:version>${metadata.version}</hwpx:version>
      <hwpx:created>${metadata.exportedAt}</hwpx:created>
      <hwpx:resident>${escapeXml(metadata.residentName)}</hwpx:resident>
    </hwpx:metadata>
  </hwpx:head>
  <hwpx:body>
    <hwpx:section id="sec0">
      <hwpx:p>
        <hwpx:run>
          <hwpx:t style="font-size:16pt; font-weight:bold; align:center;">${escapeXml(docTitle)}</hwpx:t>
        </hwpx:run>
      </hwpx:p>
      <hwpx:p>
        <hwpx:run>
          <hwpx:t style="font-size:9pt; color:#666666;">이용자: ${escapeXml(metadata.residentName)} | 작성자: ${escapeXml(metadata.author)} | 검토자: ${escapeXml(metadata.reviewer)} | 승인자: ${escapeXml(metadata.approver)} | v${metadata.version} (${metadata.exportedAt})</hwpx:t>
        </hwpx:run>
      </hwpx:p>
      <hwpx:p><hwpx:run><hwpx:t>--------------------------------------------------------------------------------</hwpx:t></hwpx:run></hwpx:p>
      ${paragraphsXml}
    </hwpx:section>
  </hwpx:body>
</hwpx:document>`;

  return xmlContent;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function downloadHwpxFile(
  filename: string,
  docTitle: string,
  blocks: RecordBlock[],
  metadata: ExportMetadata
) {
  const xmlData = generateHwpxXml(docTitle, blocks, metadata);
  const blob = new Blob([xmlData], { type: "application/vnd.hancom.hwpx+xml;charset=utf-8" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith(".hwpx") ? filename : `${filename}.hwpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
