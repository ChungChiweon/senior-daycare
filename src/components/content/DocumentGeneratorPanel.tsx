"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  FileCode,
  History,
  MessageSquare,
  Printer,
  RefreshCw,
  Save,
  Send,
  Share2,
  Sparkles,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DOCUMENT_REGISTRY, getTemplateById } from "@/lib/documents/document-template-registry";
import { buildDocumentPrompt } from "@/lib/documents/document-prompt-builder";
import { getActionConfig } from "@/lib/documents/document-action-policy";
import type { DocumentAction, DocumentCategoryKey, DocumentTemplateDefinition } from "@/types/document-template";
import { localDocumentRepository } from "@/lib/repository/local-document-repository";
import { downloadPdfFile } from "@/lib/pdf-exporter";
import type { ExportMetadata, RecordBlock } from "@/types/record-block";
import type { FieldRecord } from "@/components/content/MobileFieldLogger";
import { detectRecordConflicts, type RecordConflict } from "@/lib/ai/record-conflict-detector";
import { FactTraceabilityModal } from "@/components/content/FactTraceabilityModal";
import { useCurrentUser } from "@/hooks/use-auth-org";

type Props = {
  residentName: string;
  blocks: RecordBlock[];
  fieldRecords?: FieldRecord[];
  residents?: { id: string; name: string }[];
  activeResidentId?: string;
  onSelectResident?: (id: string) => void;
};

type DocumentVersion = {
  version: number;
  time: string;
  date: string;
  text: string;
  savedAt?: string;
  isSaved?: boolean;
  generationMode?: "llm_refined" | "deterministic_fallback";
};

type CategoryGroup = {
  category: DocumentCategoryKey;
  label: string;
  icon: string;
  items: DocumentTemplateDefinition[];
};

export function DocumentGeneratorPanel({
  residentName,
  blocks,
  fieldRecords = [],
  residents = [],
  activeResidentId = "res-01",
  onSelectResident
}: Props) {
  const currentUser = useCurrentUser();
  // Version history per document ID: Record<docId, DocumentVersion[]>
  const [versionHistory, setVersionHistory] = useState<Record<string, DocumentVersion[]>>({});
  // Selected version index per document ID: Record<docId, number>
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<Record<string, number>>({});

  // Accordion open states
  const [expandedCategories, setExpandedCategories] = useState<Record<DocumentCategoryKey, boolean>>({
    guardian: true,
    internal: true,
    program: true,
    operation: true
  });
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({ doc_01: true });

  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [notification, setNotification] = useState("");
  const [tracingSentence, setTracingSentence] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toLocaleDateString("ko-KR"), []);

  const detectedConflicts: RecordConflict[] = useMemo(() => {
    return detectRecordConflicts(blocks, residentName, activeResidentId);
  }, [blocks, residentName, activeResidentId]);

  // 4 Document Categories mapped to DOCUMENT_REGISTRY
  const categories: CategoryGroup[] = useMemo(
    () => [
      {
        category: "guardian",
        label: "보호자 소통",
        icon: "💬",
        items: DOCUMENT_REGISTRY.filter((d) => d.category === "guardian")
      },
      {
        category: "internal",
        label: "법정·내부 기록",
        icon: "📄",
        items: DOCUMENT_REGISTRY.filter((d) => d.category === "internal")
      },
      {
        category: "program",
        label: "프로그램 문서",
        icon: "🎨",
        items: DOCUMENT_REGISTRY.filter((d) => d.category === "program")
      },
      {
        category: "operation",
        label: "홍보·운영",
        icon: "📢",
        items: DOCUMENT_REGISTRY.filter((d) => d.category === "operation")
      }
    ],
    []
  );

  // Restore snapshots from localDocumentRepository upon mount / resident change
  useEffect(() => {
    const snapshots = localDocumentRepository.getSnapshotsByResident(activeResidentId);
    if (snapshots.length > 0) {
      const restoredHistory: Record<string, DocumentVersion[]> = {};
      const restoredIdx: Record<string, number> = {};

      snapshots.forEach((snap) => {
        const docId = snap.templateId;
        if (!restoredHistory[docId]) {
          restoredHistory[docId] = [];
        }
        restoredHistory[docId].push({
          version: restoredHistory[docId].length + 1,
          time: snap.createdAt.slice(11, 19) || new Date().toLocaleTimeString("ko-KR"),
          date: todayStr,
          text: snap.editedText || snap.assembledText,
          savedAt: snap.updatedAt.slice(11, 19),
          isSaved: true
        });
        restoredIdx[docId] = 0;
      });

      setVersionHistory(restoredHistory);
      setSelectedVersionIdx(restoredIdx);
    }
  }, [activeResidentId, todayStr]);

  // Generated documents count
  const generatedCount = useMemo(() => {
    return Object.values(versionHistory).filter((list) => list.length > 0).length;
  }, [versionHistory]);

  const totalCount = DOCUMENT_REGISTRY.length;

  // Single Document Generation with Document Registry & Block Filtering
  async function handleGenerateSingle(template: DocumentTemplateDefinition) {
    const timeStr = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Build prompt & filter blocks using Document Prompt Builder
    const promptInfo = buildDocumentPrompt(template, blocks, residentName, todayStr, fieldRecords);

    try {
      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentName,
          activityDate: todayStr,
          docId: template.id,
          blocks: promptInfo.filteredBlocks,
          fieldRecords
        })
      });
      const data = await res.json();
      const newText = data.text;
      const genMode = data.generation_mode || "deterministic_fallback";

      setVersionHistory((prev) => {
        const currentList = prev[template.id] || [];
        const newVerNumber = currentList.length + 1;
        const newVer: DocumentVersion = {
          version: newVerNumber,
          time: timeStr,
          date: todayStr,
          text: newText,
          isSaved: false,
          generationMode: genMode
        };
        return { ...prev, [template.id]: [newVer, ...currentList] };
      });

      setSelectedVersionIdx((prev) => ({ ...prev, [template.id]: 0 }));
      setExpandedDocs((prev) => ({ ...prev, [template.id]: true }));

      const verCount = (versionHistory[template.id]?.length || 0) + 1;
      setNotification(`✨ [${template.title}] v${verCount} 문안이 생성되었습니다.`);
      setTimeout(() => setNotification(""), 3500);
    } catch (err) {
      console.error("Single generation error", err);
    }
  }

  // Batch Generate ALL 20 Documents
  async function handleGenerateAll() {
    setIsBatchGenerating(true);
    setBatchProgress(0);
    const timeStr = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    try {
      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentName,
          activityDate: todayStr,
          blocks,
          fieldRecords
        })
      });
      const data = await res.json();
      const results = data.results || {};

      setVersionHistory((prev) => {
        const nextHist: Record<string, DocumentVersion[]> = { ...prev };
        Object.entries(results).forEach(([docId, val]) => {
          const itemVal = val as { text: string; timestamp: string; generation_mode?: "llm_refined" | "deterministic_fallback" };
          const currentList = nextHist[docId] || [];
          const newVerNumber = currentList.length + 1;
          const newVer: DocumentVersion = {
            version: newVerNumber,
            time: itemVal.timestamp || timeStr,
            date: todayStr,
            text: itemVal.text,
            isSaved: false,
            generationMode: itemVal.generation_mode || "deterministic_fallback"
          };
          nextHist[docId] = [newVer, ...currentList];
        });
        return nextHist;
      });

      const nextIdx: Record<string, number> = {};
      DOCUMENT_REGISTRY.forEach((d) => (nextIdx[d.id] = 0));
      setSelectedVersionIdx(nextIdx);

      setIsBatchGenerating(false);
      setNotification(`✨ [${residentName} 어르신] 전체 20종 문서의 최신 버전이 정상 작성되었습니다!`);
      setTimeout(() => setNotification(""), 5000);
    } catch {
      setIsBatchGenerating(false);
    }
  }

  // Handle Manual User Text Modification & Retain Edits
  function handleTextChange(docId: string, newText: string) {
    setVersionHistory((prev) => {
      const list = prev[docId] || [];
      if (list.length === 0) return prev;
      const idx = selectedVersionIdx[docId] || 0;
      const updatedList = [...list];
      updatedList[idx] = {
        ...updatedList[idx],
        text: newText,
        isSaved: false
      };
      return { ...prev, [docId]: updatedList };
    });
  }

  // Execute Action Policy (Save, Send, PDF Export, HWPX)
  function handleExecuteAction(template: DocumentTemplateDefinition, action: DocumentAction) {
    const history = versionHistory[template.id] || [];
    const idx = selectedVersionIdx[template.id] || 0;
    const activeVer = history[idx];

    if (!activeVer) return;

    const config = getActionConfig(action);

    if (action === "save") {
      localDocumentRepository.saveSnapshot({
        documentId: `doc-${template.id}-${Date.now()}`,
        templateId: template.id,
        residentId: activeResidentId,
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

      setVersionHistory((prev) => {
        const list = prev[template.id] || [];
        const updatedList = [...list];
        updatedList[idx] = {
          ...updatedList[idx],
          isSaved: true,
          savedAt: new Date().toLocaleTimeString("ko-KR")
        };
        return { ...prev, [template.id]: updatedList };
      });
    } else if (action === "export_pdf") {
      const authorName = currentUser?.name
        ? `${currentUser.name} (${currentUser.roleLabel})`
        : "작성자 미지정";
      const exportMetadata: ExportMetadata = {
        author: authorName,
        reviewer: "미지정",
        approver: "미지정",
        version: activeVer.version,
        exportedAt: activeVer.time,
        documentTitle: template.title,
        residentName
      };
      downloadPdfFile(`${template.title}_${residentName}.pdf`, template.title, blocks, exportMetadata);
    }

    setNotification(`✅ [${template.title} v${activeVer.version}] ${config.confirmMessage}`);
    setTimeout(() => setNotification(""), 3500);
  }

  function toggleCategory(cat: DocumentCategoryKey) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function toggleDoc(docId: string) {
    setExpandedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  }

  function getActionIcon(iconName: string) {
    switch (iconName) {
      case "Save":
        return <Save size={13} />;
      case "Send":
        return <Send size={13} />;
      case "MessageSquare":
        return <MessageSquare size={13} />;
      case "Printer":
        return <Printer size={13} />;
      case "FileCode":
        return <FileCode size={13} />;
      case "Share2":
        return <Share2 size={13} />;
      default:
        return <CheckCircle2 size={13} />;
    }
  }

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm space-y-4 text-xs">
      {/* 👥 Resident Selector Tabs */}
      {residents.length > 0 && onSelectResident && (
        <div className="rounded-lg bg-slate-100 p-1.5 flex overflow-x-auto gap-1 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 self-center px-1 shrink-0">문서 대상 수급자:</span>
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

      {/* 🚀 Main Header Banner */}
      <div className="rounded-xl bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 p-4 text-white shadow-md space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-[10px] mb-1 font-bold">
              레지스트리 기반 20종 AI 문서 자동 작성 시스템
            </Badge>
            <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
              “오늘 기록 한 번으로 <span className="text-sky-300 underline underline-offset-4 font-black">20종 문서</span>가 자동 작성됩니다.”
            </h3>
            <p className="text-[11px] text-slate-300 mt-1">
              수급자: <strong className="text-white font-bold">{residentName} 어르신</strong> | 작성일: {todayStr} (동일 날짜 생성 시 v1, v2, v3 누적)
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-sky-400">{generatedCount}</span>
            <span className="text-xs text-slate-400 font-bold"> / {totalCount}종</span>
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

        {/* Batch Generate Button */}
        <Button
          disabled={isBatchGenerating}
          onClick={handleGenerateAll}
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 font-black text-xs h-10 shadow-lg flex items-center justify-center gap-2 border border-sky-300/30"
        >
          {isBatchGenerating ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              <span>실시간 AI 20종 문서 동적 합성 중...</span>
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

      {/* ⚠️ AI Record Conflict Warning Banner */}
      {detectedConflicts.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
            <Zap size={15} className="text-amber-600 shrink-0" />
            <span>⚠ 확인 필요: 원본 관찰 기록 간 내용 차이가 감지되었습니다. (AI 충돌 보호)</span>
          </div>
          {detectedConflicts.map((cf) => (
            <p key={cf.id} className="text-[11px] text-amber-900 font-semibold leading-relaxed pl-5">
              • {cf.description}
            </p>
          ))}
          <p className="text-[10px] text-amber-800 font-bold pl-5">
            💡 문서 생성 및 조립은 가능하나, 사회복지사 검토 후 최종 결재 승인 진행을 권장합니다.
          </p>
        </div>
      )}

      {/* 🔍 Fact Traceability Modal */}
      {tracingSentence && (
        <FactTraceabilityModal
          sentenceText={tracingSentence}
          sourceBlock={blocks[0]}
          onClose={() => setTracingSentence(null)}
        />
      )}

      {/* 📁 4 Category Accordion Groups */}
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

              {/* Category Items */}
              {isCatExpanded && (
                <div className="p-2 space-y-2 bg-white">
                  {catGroup.items.map((template) => {
                    const history = versionHistory[template.id] || [];
                    const hasVersions = history.length > 0;
                    const activeIdx = selectedVersionIdx[template.id] || 0;
                    const activeVersion = history[activeIdx] || null;
                    const isDocOpen = expandedDocs[template.id] ?? false;

                    return (
                      <div
                        key={template.id}
                        className={`rounded-lg border transition-all ${
                          hasVersions ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-white"
                        }`}
                      >
                        {/* Item Bar */}
                        <div
                          onClick={() => toggleDoc(template.id)}
                          className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{template.title}</span>
                            {hasVersions ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] flex items-center gap-1 font-bold">
                                <CheckCircle2 size={11} /> 생성 완료 (v{history[0].version})
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[10px]">
                                미생성
                              </Badge>
                            )}

                            {history.length > 1 && (
                              <Badge className="bg-sky-100 text-sky-800 border-sky-200 text-[9px] font-extrabold flex items-center gap-1">
                                <History size={10} /> {history.length}개 버전 누적
                              </Badge>
                            )}

                            {hasVersions && activeVersion?.generationMode === "llm_refined" && (
                              <Badge className="bg-emerald-600 text-white font-bold text-[9px]">
                                ✨ AI 문장 초안
                              </Badge>
                            )}
                            {hasVersions && activeVersion?.generationMode === "deterministic_fallback" && (
                              <Badge className="bg-slate-500 text-white font-bold text-[9px]">
                                📋 기록 기반 자동 초안
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 hidden sm:inline">{template.targetAudienceLabel}</span>
                            {isDocOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </div>

                        {/* Item Accordion Body */}
                        {isDocOpen && (
                          <div className="border-t border-slate-100 p-3 space-y-3 bg-white">
                            {/* Minimum 1-line description */}
                            <p className="text-[11px] text-slate-500">{template.description}</p>

                            {!hasVersions || !activeVersion ? (
                              /* BEFORE GENERATION STATE: Body is completely EMPTY! */
                              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center space-y-2">
                                <p className="text-[11px] text-slate-500 font-bold">
                                  아직 생성되지 않았습니다.
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  아래 [AI 생성] 버튼을 누르면 입력 사실(RecordBlock 및 외근 팩트)을 조합하여 실제 문안이 작성됩니다.
                                </p>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerateSingle(template);
                                  }}
                                  className="bg-sky-600 hover:bg-sky-700 font-bold text-xs h-8 px-3 inline-flex items-center gap-1.5 text-white"
                                >
                                  <Zap size={13} /> AI 생성
                                </Button>
                              </div>
                            ) : (
                              /* AFTER GENERATION STATE: Editable Text Area + Version Controls + Policy Actions */
                              <div className="space-y-2.5">
                                {/* Version Selector Bar */}
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <History size={13} className="text-sky-600" />
                                    <span className="font-bold text-slate-800">버전 히스토리:</span>
                                    <select
                                      value={activeIdx}
                                      onChange={(e) =>
                                        setSelectedVersionIdx((prev) => ({
                                          ...prev,
                                          [template.id]: Number(e.target.value)
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

                                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Clock size={11} /> 생성: {activeVersion.time}
                                    </span>
                                    {activeVersion.isSaved && (
                                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[9px] font-bold">
                                        💾 저장 완료 ({activeVersion.savedAt})
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    <Edit3 size={12} /> v{activeVersion.version} 생성 문안 (수정 가능):
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setTracingSentence(activeVersion.text.slice(0, 100))}
                                    className="text-sky-700 hover:text-sky-900 font-extrabold flex items-center gap-1 text-[11px] underline"
                                  >
                                    <Sparkles size={12} /> [🔍 원천 팩트 근거 보기]
                                  </button>
                                  <span className="text-[10px] text-slate-400">
                                    대상: {template.targetAudienceLabel} | 톤: {template.tone}
                                  </span>
                                </div>

                                {/* Editable Text Area */}
                                <textarea
                                  rows={5}
                                  value={activeVersion.text}
                                  onChange={(e) => handleTextChange(template.id, e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 font-sans focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all leading-relaxed"
                                />

                                {/* Action Buttons Separated by Action Policy */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {template.actions.map((act) => {
                                      const config = getActionConfig(act);
                                      return (
                                        <Button
                                          key={act}
                                          className={`h-7 px-2.5 text-[11px] flex items-center gap-1 ${config.buttonClass}`}
                                          onClick={() => handleExecuteAction(template, act)}
                                        >
                                          {getActionIcon(config.iconName)}
                                          <span>{config.label}</span>
                                        </Button>
                                      );
                                    })}
                                  </div>

                                  <Button
                                    variant="ghost"
                                    className="text-sky-700 hover:bg-sky-50 font-bold text-[10px] h-7 px-2 flex items-center gap-1"
                                    onClick={() => handleGenerateSingle(template)}
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
