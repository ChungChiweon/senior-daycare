"use client";

import { useMemo, useState } from "react";
import {
  FileCode,
  Printer,
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadHwpxFile } from "@/lib/hwpx-exporter";
import { downloadPdfFile } from "@/lib/pdf-exporter";
import type { DocumentTemplate, ExportMetadata, RecordBlock } from "@/types/record-block";

type Props = {
  templates: DocumentTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  blocks: RecordBlock[];
  residentName: string;
};

export function DocumentAssemblyPanel({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  blocks,
  residentName
}: Props) {
  const [author, setAuthor] = useState("박지영 사회복지사");
  const [reviewer, setReviewer] = useState("김철수 팀장");
  const [approver, setApprover] = useState("이영희 센터장");
  const [isApproved, setIsApproved] = useState(false);
  const [notification, setNotification] = useState("");

  const activeTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  // Order RecordBlocks according to DocumentTemplate's blockOrder!
  const assembledBlocks = useMemo(() => {
    const map = new Map<string, RecordBlock>();
    blocks.forEach((b) => map.set(b.blockType, b));

    const result: RecordBlock[] = [];
    activeTemplate.blockOrder.forEach((blockType) => {
      const found = map.get(blockType);
      if (found) {
        result.push(found);
      }
    });
    return result;
  }, [blocks, activeTemplate]);

  const exportMetadata: ExportMetadata = useMemo(() => {
    return {
      author,
      reviewer,
      approver,
      version: 1,
      exportedAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      documentTitle: activeTemplate.title,
      residentName
    };
  }, [author, reviewer, approver, activeTemplate, residentName]);

  const hwpxTemplateAvailable = false; // Priority 3: Keep safely disabled if base ZIP template file is not uploaded

  function handleDownloadHwpx() {
    if (!hwpxTemplateAvailable) {
      alert("정상 HWPX ZIP 템플릿 파일이 업로드되지 않아 안전 비활성화 상태입니다.");
      return;
    }
    downloadHwpxFile(
      `${activeTemplate.title}_${residentName}.hwpx`,
      activeTemplate.title,
      assembledBlocks,
      exportMetadata
    );
    setNotification("📝 HWPX 한글 문서 파일이 다운로드되었습니다.");
    setTimeout(() => setNotification(""), 4000);
  }

  function handleDownloadPdf() {
    downloadPdfFile(
      `${activeTemplate.title}_${residentName}.pdf`,
      activeTemplate.title,
      assembledBlocks,
      exportMetadata
    );
    setNotification("📄 실제 PDF 문서 파일이 생성되어 다운로드되었습니다.");
    setTimeout(() => setNotification(""), 4000);
  }

  function handlePrintPdf() {
    window.print();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4 text-xs">
      {/* Header */}
      <div className="border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <span>📑 문서 조립 및 HWPX/PDF 출력</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          문서 순서는 입력 순서가 아닌 <strong className="text-sky-700 font-bold">DocumentTemplate</strong> 규격이 결정합니다.
        </p>
      </div>

      {/* Document Template Selector */}
      <div>
        <label className="font-bold text-slate-700 block mb-1">조립 템플릿 선택</label>
        <select
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-300"
          value={selectedTemplateId}
          onChange={(e) => onSelectTemplate(e.target.value)}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.categoryLabel})
            </option>
          ))}
        </select>
      </div>

      {/* Assembled Blocks Sequence Preview */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 border-b border-slate-200 pb-1.5">
          <span>조립 순서 ({assembledBlocks.length}개 블록)</span>
          <Badge className="bg-sky-100 text-sky-800 text-[10px]">톤: {activeTemplate.toneStyle}</Badge>
        </div>

        <div className="space-y-1 text-[11px]">
          {assembledBlocks.map((b, idx) => (
            <div key={b.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-100">
              <span className="font-semibold text-slate-800 line-clamp-1">
                {idx + 1}. {b.title}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">{b.sourceType}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata & Approval Controls */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 text-[11px]">
        <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">✍️ 결재 및 문서 보관 메타데이터</span>
        <div className="grid grid-cols-3 gap-1.5">
          <div>
            <label className="text-slate-500 block">작성자</label>
            <input
              type="text"
              className="h-7 w-full rounded border border-slate-200 bg-slate-50 px-1.5 font-bold"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-slate-500 block">검토자</label>
            <input
              type="text"
              className="h-7 w-full rounded border border-slate-200 bg-slate-50 px-1.5 font-bold"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
            />
          </div>
          <div>
            <label className="text-slate-500 block">승인자</label>
            <input
              type="text"
              className="h-7 w-full rounded border border-slate-200 bg-slate-50 px-1.5 font-bold"
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Badge className={isApproved ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-amber-100 text-amber-800 font-bold"}>
            {isApproved ? "최종 결재 승인됨" : "승인 대기 중"}
          </Badge>
          <Button
            variant="secondary"
            className="h-7 text-[11px] font-bold px-2"
            onClick={() => setIsApproved(!isApproved)}
          >
            {isApproved ? "승인 취소" : "최종 결재 승인"}
          </Button>
        </div>
      </div>

      {notification && <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 font-bold text-emerald-800 text-[11px]">{notification}</div>}

      {/* Export Action Buttons */}
      <div className="space-y-2 pt-1">
        <Button
          disabled={!hwpxTemplateAvailable}
          className="w-full bg-slate-700 hover:bg-slate-800 font-bold text-xs h-10 flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60"
          onClick={handleDownloadHwpx}
        >
          <FileCode size={15} /> HWPX 한글 템플릿 다운로드 {hwpxTemplateAvailable ? "" : "(템플릿 미등록 - 비활성)"}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-sky-600 hover:bg-sky-700 font-bold text-xs h-9" onClick={handleDownloadPdf}>
            <Printer size={14} /> 실제 PDF 파일 생성
          </Button>
          <Button variant="secondary" className="font-bold text-xs h-9" onClick={() => alert("보호자 전송 채널로 제출되었습니다.")}>
            <Send size={14} /> 보호자 전송
          </Button>
        </div>
      </div>
    </div>
  );
}
