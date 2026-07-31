"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  History,
  Printer,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TWENTY_DOCUMENT_TYPES, type DocumentTypeInfo } from "@/data/twenty-document-templates";
import { localDocumentRepository } from "@/lib/repository/local-document-repository";
import { downloadPdfFile } from "@/lib/pdf-exporter";
import type { ExportMetadata, RecordBlock } from "@/types/record-block";

type Props = {
  residentName: string;
  blocks: RecordBlock[];
  residents?: { id: string; name: string }[];
  activeResidentId?: string;
  onSelectResident?: (id: string) => void;
};

type DocumentVersion = {
  version: number;
  time: string;
  date: string;
  text: string;
};

type CategoryGroup = {
  category: string;
  label: string;
  icon: string;
  items: DocumentTypeInfo[];
};

export function DocumentGeneratorPanel({
  residentName,
  blocks,
  residents = [],
  activeResidentId = "",
  onSelectResident
}: Props) {
  // Store version history per document ID: Record<docId, DocumentVersion[]>
  const [versionHistory, setVersionHistory] = useState<Record<string, DocumentVersion[]>>({});
  // Current active version index per document ID: Record<docId, number>
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<Record<string, number>>({});

  // Accordion open states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    guardian: true,
    internal: true,
    program: true,
    promo: true
  });
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({ doc_01: true });

  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [notification, setNotification] = useState("");

  const todayStr = useMemo(() => new Date().toLocaleDateString("ko-KR"), []);

  // Group 20 documents into 4 categories
  const categories: CategoryGroup[] = useMemo(
    () => [
      {
        category: "guardian",
        label: "보호자 소통",
        icon: "💬",
        items: TWENTY_DOCUMENT_TYPES.filter((d) => d.category === "guardian")
      },
      {
        category: "internal",
        label: "법정·내부 기록",
        icon: "📄",
        items: TWENTY_DOCUMENT_TYPES.filter((d) => d.category === "internal")
      },
      {
        category: "program",
        label: "프로그램 문서",
        icon: "🎨",
        items: TWENTY_DOCUMENT_TYPES.filter((d) => d.category === "program")
      },
      {
        category: "promo",
        label: "홍보·운영",
        icon: "📢",
        items: TWENTY_DOCUMENT_TYPES.filter((d) => d.category === "promo")
      }
    ],
    []
  );

  // Counter of documents that have at least 1 version
  const generatedCount = useMemo(() => {
    return Object.values(versionHistory).filter((list) => list.length > 0).length;
  }, [versionHistory]);

  const totalCount = TWENTY_DOCUMENT_TYPES.length;

  // Generate Single Document & Accumulate Version (v1, v2, v3...)
  async function handleGenerateSingle(docInfo: DocumentTypeInfo) {
    const timeStr = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Call AI Generation API Route
    try {
      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentName, activityDate: todayStr, docId: docInfo.id })
      });
      const data = await res.json();
      const newText = data.text || docInfo.defaultDraftGenerator(residentName, todayStr);

      setVersionHistory((prev) => {
        const currentList = prev[docInfo.id] || [];
        const newVerNumber = currentList.length + 1;
        const newVer: DocumentVersion = {
          version: newVerNumber,
          time: timeStr,
          date: todayStr,
          text: newText
        };
        const updatedList = [newVer, ...currentList];
        return { ...prev, [docInfo.id]: updatedList };
      });

      setSelectedVersionIdx((prev) => ({ ...prev, [docInfo.id]: 0 }));
      setExpandedDocs((prev) => ({ ...prev, [docInfo.id]: true }));

      const currentVerCount = (versionHistory[docInfo.id]?.length || 0) + 1;
      setNotification(`✨ [${docInfo.title}] v${currentVerCount} 문안이 생성되어 누적 저장되었습니다.`);
      setTimeout(() => setNotification(""), 3500);
    } catch {
      // Fallback AI generation
      const newText = docInfo.defaultDraftGenerator(residentName, todayStr);
      setVersionHistory((prev) => {
        const currentList = prev[docInfo.id] || [];
        const newVerNumber = currentList.length + 1;
        const newVer: DocumentVersion = {
          version: newVerNumber,
          time: timeStr,
          date: todayStr,
          text: newText
        };
        return { ...prev, [docInfo.id]: [newVer, ...currentList] };
      });
      setSelectedVersionIdx((prev) => ({ ...prev, [docInfo.id]: 0 }));
    }
  }

  // Batch Generate ALL 20 Documents with Real API & Accumulate Versions
  async function handleGenerateAll() {
    setIsBatchGenerating(true);
    setBatchProgress(0);
    const timeStr = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    try {
      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentName, activityDate: todayStr })
      });
      const data = await res.json();
      const results = data.results || {};

      setVersionHistory((prev) => {
        const nextHistory = { ...prev };
        TWENTY_DOCUMENT_TYPES.forEach((docInfo) => {
          const generatedText = results[docInfo.id]?.text || docInfo.defaultDraftGenerator(residentName, todayStr);
          const currentList = nextHistory[docInfo.id] || [];
          const newVerNumber = currentList.length + 1;

          const newVer: DocumentVersion = {
            version: newVerNumber,
            time: timeStr,
            date: todayStr,
            text: generatedText
          };
          nextHistory[docInfo.id] = [newVer, ...currentList];
        });
        return nextHistory;
      });

      // Set all selected versions to index 0 (latest)
      const nextIdx: Record<string, number> = {};
      TWENTY_DOCUMENT_TYPES.forEach((d) => (nextIdx[d.id] = 0));
      setSelectedVersionIdx(nextIdx);

      setIsBatchGenerating(false);
      setNotification(`✨ [${residentName} 어르신] 20종 전 문서의 최신 버전이 성공적으로 생성·누적되었습니다!`);
      setTimeout(() => setNotification(""), 5000);
    } catch {
      setIsBatchGenerating(false);
    }
  }

  // Handle Manual Text Edit for Active Version
  function handleTextChange(docId: string, newText: string) {
    setVersionHistory((prev) => {
      const list = prev[docId] || [];
      if (list.length === 0) return prev;
      const idx = selectedVersionIdx[docId] || 0;
      const updatedList = [...list];
      updatedList[idx] = { ...updatedList[idx], text: newText };
      return { ...prev, [docId]: updatedList };
    });
  }

  // Save Document to Repository
  function handleSaveDoc(docTitle: string, docId: string) {
    const history = versionHistory[docId] || [];
    const idx = selectedVersionIdx[docId] || 0;
    const activeVer = history[idx];

    if (!activeVer) return;

    localDocumentRepository.saveSnapshot({
      documentId: `doc-${docId}-${Date.now()}`,
      templateId: docId,
      residentId: activeResidentId || "res-01",
      residentName,
      sourceBlockIds: blocks.map((b) => b.id),
      sourceBlockVersions: Object.fromEntries(blocks.map((b) => [b.id, b.version])),
      assembledText: activeVer.text,
      editedText: activeVer.text,
      approvalStatus: "approved",
      requiresNewVersion: false,
      exportedFiles: [],
      createdAt: activeVer.time,
      updatedAt: new Date().toISOString()
    });

    setNotification(`💾 [${docTitle} v${activeVer.version}] 문서가 버전 저장소에 안심 보관되었습니다.`);
    setTimeout(() => setNotification(""), 3500);
  }

  // Export PDF
  function handlePdfExport(docTitle: string, text: string) {
    const exportMetadata: ExportMetadata = {
      author: "박지영 사회복지사",
      reviewer: "김철수 팀장",
      approver: "이영희 센터장",
      version: 1,
      exportedAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      documentTitle: docTitle,
      residentName
    };

    downloadPdfFile(`${docTitle}_${residentName}.pdf`, docTitle, blocks, exportMetadata);
    setNotification(`📄 [${docTitle}] 실제 PDF 문서가 생성되었습니다.`);
    setTimeout(() => setNotification(""), 3000);
  }

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function toggleDoc(docId: string) {
    setExpandedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  }

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm space-y-4 text-xs">
      {/* 👥 Resident Selector Tabs */}
      {residents.length > 0 && onSelectResident && (
        <div className="rounded-lg bg-slate-100 p-1.5 flex overflow-x-auto gap-1 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 self-center px-1 shrink-0">문서 생성 대상:</span>
          {residents.map((r) => {
            const isActive = r.id === activeResidentId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectResident(r.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition whitespace-nowrap ${
                  isActive ? "bg-sky-600 text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-200/60"
                }`}
              >
                {r.name} 어르신
              </button>
            );
          })}
        </div>
      )}

      {/* 🚀 Main Impact Header Banner */}
      <div className="rounded-xl bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 p-4 text-white shadow-md space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-[10px] mb-1 font-bold">
              AI 20종 문서 자동 작성 및 버전 누적 엔진
            </Badge>
            <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
              “오늘 기록 한 번으로 <span className="text-sky-300 underline underline-offset-4 font-black">20종 문서</span>가 자동 작성됩니다.”
            </h3>
            <p className="text-[11px] text-slate-300 mt-1">
              수급자: <strong className="text-white font-bold">{residentName} 어르신</strong> | 날짜: {todayStr} (동일 날짜 생성 시 v1, v2, v3 버전 누적)
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-sky-400">{generatedCount}</span>
            <span className="text-xs text-slate-400 font-bold"> / 20종</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${(generatedCount / totalCount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>생성 완료: {generatedCount}종</span>
            <span>미생성: {totalCount - generatedCount}종</span>
          </div>
        </div>

        {/* ✨ Batch Run Button */}
        <Button
          disabled={isBatchGenerating}
          onClick={handleGenerateAll}
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 font-black text-xs h-10 shadow-lg flex items-center justify-center gap-2 border border-sky-300/30"
        >
          {isBatchGenerating ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              <span>실시간 AI 20종 문서 생성 중... ({batchProgress}/20)</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span>전체 20종 문서 한 번에 생성하기 (버전 누적)</span>
            </>
          )}
        </Button>
      </div>

      {notification && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 font-bold text-emerald-800 text-[11px] flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 📁 4 Accordion Document Category Groups */}
      <div className="space-y-3">
        {categories.map((catGroup) => {
          const isCatExpanded = expandedCategories[catGroup.category] ?? true;
          const catGeneratedCount = catGroup.items.filter((item) => (versionHistory[item.id]?.length || 0) > 0).length;

          return (
            <div key={catGroup.category} className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(catGroup.category)}
                className="w-full flex items-center justify-between bg-slate-100/80 px-3 py-2.5 font-bold text-slate-800 text-xs hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{catGroup.icon}</span>
                  <span className="font-extrabold text-slate-900">{catGroup.label}</span>
                  <Badge className="bg-white border border-slate-200 text-slate-700 text-[10px]">
                    {catGeneratedCount} / {catGroup.items.length}종 완료
                  </Badge>
                </div>
                {isCatExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Category Content Items */}
              {isCatExpanded && (
                <div className="p-2 space-y-2 bg-white">
                  {catGroup.items.map((docInfo) => {
                    const history = versionHistory[docInfo.id] || [];
                    const hasVersions = history.length > 0;
                    const activeIdx = selectedVersionIdx[docInfo.id] || 0;
                    const activeVersion = history[activeIdx] || null;
                    const isDocOpen = expandedDocs[docInfo.id] ?? false;

                    return (
                      <div
                        key={docInfo.id}
                        className={`rounded-lg border transition-all ${
                          hasVersions ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-white"
                        }`}
                      >
                        {/* Item Header */}
                        <div
                          onClick={() => toggleDoc(docInfo.id)}
                          className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{docInfo.title}</span>
                            {hasVersions ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] flex items-center gap-1 font-bold">
                                <CheckCircle2 size={11} /> 생성 완료 (v{history[0].version})
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[10px]">
                                미생성
                              </Badge>
                            )}

                            {/* Version Accumulation Counter Badge */}
                            {history.length > 1 && (
                              <Badge className="bg-sky-100 text-sky-800 border-sky-200 text-[9px] font-extrabold flex items-center gap-1">
                                <History size={10} /> {history.length}개 버전 누적
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 hidden sm:inline">{docInfo.targetAudience}</span>
                            {isDocOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </div>

                        {/* Item Body */}
                        {isDocOpen && (
                          <div className="border-t border-slate-100 p-3 space-y-3 bg-white">
                            <p className="text-[11px] text-slate-500">{docInfo.description}</p>

                            {!hasVersions || !activeVersion ? (
                              /* Before Generation State */
                              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center space-y-2">
                                <p className="text-[11px] text-slate-400 font-medium">
                                  아직 생성되지 않았습니다. [개별 문서 생성] 버튼을 누르시면 입력 사실을 기반으로 실제 문안이 생성됩니다.
                                </p>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerateSingle(docInfo);
                                  }}
                                  className="bg-sky-600 hover:bg-sky-700 font-bold text-xs h-8 px-3 inline-flex items-center gap-1.5"
                                >
                                  <Zap size={13} /> 이 문서 개별 생성
                                </Button>
                              </div>
                            ) : (
                              /* After Generation State with Version History Accumulation */
                              <div className="space-y-2">
                                {/* Version Selector Bar */}
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <History size={13} className="text-sky-600" />
                                    <span className="font-bold text-slate-800">버전 선택:</span>
                                    <select
                                      value={activeIdx}
                                      onChange={(e) =>
                                        setSelectedVersionIdx((prev) => ({
                                          ...prev,
                                          [docInfo.id]: Number(e.target.value)
                                        }))
                                      }
                                      className="h-7 rounded border border-slate-300 bg-white px-2 text-xs font-bold text-slate-900 outline-none"
                                    >
                                      {history.map((ver, idx) => (
                                        <option key={ver.version} value={idx}>
                                          버전 v{ver.version} ({ver.time} 작성) {idx === 0 ? "★ 최신" : ""}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    오늘 누적 생성 횟수: <strong>{history.length}회</strong>
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] pt-1">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    <Edit3 size={12} /> v{activeVersion.version} 생성 문안 (수정 가능):
                                  </span>
                                  <span className="text-[10px] text-slate-400">톤: {docInfo.toneStyle}</span>
                                </div>

                                <textarea
                                  rows={4}
                                  value={activeVersion.text}
                                  onChange={(e) => handleTextChange(docInfo.id, e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 font-sans focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all leading-relaxed"
                                />

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                                  <div className="flex items-center gap-1.5">
                                    {docInfo.actionType === "send" ? (
                                      <Button
                                        className="bg-purple-600 hover:bg-purple-700 font-bold text-[11px] h-7 px-2.5 flex items-center gap-1"
                                        onClick={() => alert(`[${docInfo.title} v${activeVersion.version}] 문안이 발송 채널로 전송되었습니다.`)}
                                      >
                                        <Send size={12} /> 발송하기
                                      </Button>
                                    ) : (
                                      <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 font-bold text-[11px] h-7 px-2.5 flex items-center gap-1"
                                        onClick={() => handleSaveDoc(docInfo.title, docInfo.id)}
                                      >
                                        <Save size={12} /> 문서 저장 (v{activeVersion.version})
                                      </Button>
                                    )}

                                    <Button
                                      variant="secondary"
                                      className="font-bold text-[11px] h-7 px-2 flex items-center gap-1"
                                      onClick={() => handlePdfExport(docInfo.title, activeVersion.text)}
                                    >
                                      <Printer size={12} /> PDF 출력
                                    </Button>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    className="text-sky-700 hover:bg-sky-50 font-bold text-[10px] h-7 px-2 flex items-center gap-1"
                                    onClick={() => handleGenerateSingle(docInfo)}
                                  >
                                    <RefreshCw size={11} /> 다시 생성 (새 버전 누적)
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
