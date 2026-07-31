"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockResidents } from "@/data/mock-daycare-store";

const detailTabs = [
  { id: "basic", label: "기본정보" },
  { id: "guardian", label: "보호자정보" },
  { id: "contract", label: "등급/계약" },
  { id: "health", label: "건강/투약" },
  { id: "careplan", label: "급여제공계획" },
  { id: "daily", label: "일일제공기록" },
  { id: "programs", label: "프로그램참여" },
  { id: "counseling", label: "상담기록" },
  { id: "billing", label: "본인부담금" },
  { id: "documents", label: "첨부서류" },
  { id: "consents", label: "초상권/동의서" }
];

export default function ResidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const resident = mockResidents.find((r) => r.id === resolvedParams.id) ?? mockResidents[0];
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div>
        <Link href="/residents" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft size={16} />
          어르신 목록으로 돌아가기
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-white font-black text-2xl shadow-md">
              {resident.initial}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">{resident.name} 어르신</h1>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                  {resident.gradeLabel}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  {resident.attendance} ({resident.attendanceTime})
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                성별: {resident.gender} | 연령: {resident.age}세 ({resident.birthDate}) | 장기요양인정번호: <span className="font-mono">{resident.careNumber}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="text-xs font-bold">
              <Phone size={15} /> 보호자 전화
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-xs font-bold">
              <FileText size={15} /> 일지 바로작성
            </Button>
          </div>
        </div>
      </div>

      {/* 11 Sub Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-2">
        {detailTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`whitespace-nowrap px-3.5 py-2 text-xs font-bold rounded-lg transition ${activeTab === t.id ? "bg-sky-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {activeTab === "basic" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">기본 인적사항 & 케어 현황</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">성함 / 성별 / 연령</span>
                <span className="font-bold text-slate-800 text-sm">{resident.name} ({resident.gender}, {resident.age}세)</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">생년월일</span>
                <span className="font-bold text-slate-800 text-sm">{resident.birthDate}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">장기요양 인정등급</span>
                <span className="font-bold text-sky-700 text-sm">{resident.gradeLabel} ({resident.careNumber})</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">담당 주간보호 그룹</span>
                <span className="font-bold text-slate-800 text-sm">{resident.group}그룹 (중증/인지케어)</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">송영 차량 노선</span>
                <span className="font-bold text-slate-800 text-sm">{resident.shuttleRoute}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">주소</span>
                <span className="font-bold text-slate-800 text-sm">서울시 강남구 역삼동 123-45 (102호)</span>
              </div>
            </div>
            {resident.cautionNotes && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs">
                <h3 className="font-bold text-amber-900 mb-1">⚠️ 개별 케어 주의사항 및 관찰 포인트</h3>
                <p className="font-semibold text-amber-800">{resident.cautionNotes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "guardian" && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">보호자 및 비상연락처</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <Badge className="bg-sky-100 text-sky-800">주 보호자 (1순위)</Badge>
                <div className="text-sm font-bold text-slate-900 mt-2">{resident.guardianName} ({resident.guardianRelation})</div>
                <div className="text-slate-600">연락처: <span className="font-semibold">{resident.guardianPhone}</span></div>
                <div className="text-slate-600">비고: 알림장 카카오톡 수신 동의, 본인부담금 청구 대상자</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <Badge className="bg-slate-100 text-slate-700">부 보호자 (2순위)</Badge>
                <div className="text-sm font-bold text-slate-900 mt-2">김미영 (차녀)</div>
                <div className="text-slate-600">연락처: <span className="font-semibold">010-9876-5432</span></div>
                <div className="text-slate-600">비고: 비상시 2차 연락망</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contract" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">장기요양 계약 및 등급 인정서 현황</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">계약 기간</span>
                <span className="font-bold text-slate-900">2026.01.01 ~ 2026.12.31</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">본인부담율</span>
                <span className="font-bold text-sky-700">15% (일반 수급자)</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-400 font-bold block mb-1">월 이용 한도액</span>
                <span className="font-bold text-slate-900">₩1,452,100</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">건강상태 및 투약 처방전</h2>
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="font-bold text-slate-500 mb-1">최근 혈압</div>
                <div className="text-xl font-black text-slate-900">{resident.bloodPressure}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="font-bold text-slate-500 mb-1">최근 체온</div>
                <div className="text-xl font-black text-slate-900">{resident.temperature}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <div className="font-bold text-slate-500 mb-1">지정 투약 상태</div>
                <div className="text-xl font-black text-emerald-700">{resident.medication}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "careplan" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">맞춤 급여제공계획 (Care Plan)</h2>
            <div className="rounded-xl bg-sky-50 p-4 border border-sky-100 text-sky-900 font-semibold">
              🎯 목표: 하체 소근육 유연성 유지, 일일 60분 인지회상 프로그램 참여, 혈압 안정적 유지 (130 이하)
            </div>
          </div>
        )}

        {activeTab === "daily" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">최근 일일 케어 제공 기록 이력</h2>
            <div className="divide-y divide-slate-100 font-semibold text-slate-700">
              <div className="py-2.5 flex justify-between"><span>2026-07-30: 출석(08:45), 식사 전량, 투약 완료, 혈압 120/80</span><span className="text-emerald-700">작성완료</span></div>
              <div className="py-2.5 flex justify-between"><span>2026-07-29: 출석(08:42), 식사 전량, 투약 완료, 혈압 118/78</span><span className="text-emerald-700">작성완료</span></div>
            </div>
          </div>
        )}

        {activeTab === "programs" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">프로그램 참여 이력</h2>
            <div className="space-y-2 font-semibold">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">7/30 10:30 실버 건강체조 - 참여 (적극적)</div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">7/29 14:00 칠교놀이 뇌자극 - 참여 (완수)</div>
            </div>
          </div>
        )}

        {activeTab === "counseling" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">보호자 및 어르신 상담 기록</h2>
            <div className="rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="flex justify-between font-bold text-slate-900"><span>2026-07-25 정기 전화상담</span><span>담당: 박지영 사회복지사</span></div>
              <p className="text-slate-600 mt-1 font-semibold">보호자(이철수) 만족도 높음, 가정 내 야간 보행 케어 조력 안내 완료.</p>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">월별 본인부담금 청구 & 수납 내역</h2>
            <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
              <span>7월 본인부담금: ₩185,000</span>
              <span className="text-emerald-700">수납완료 (카드)</span>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">어르신 서류 & 인정서 파일</h2>
            <div className="space-y-2 font-semibold">
              <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
                <span>📄 장기요양인정서 복사본.pdf</span>
                <Button variant="secondary" className="text-[11px] font-bold py-1 h-7">보기</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "consents" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">초상권 활용 및 개인정보 동의서</h2>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
              ✅ 알림장 현황 사진 및 주간보호 소식지 초상권 사용 보호자 동의 완료 (2026-01-02 서명)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
