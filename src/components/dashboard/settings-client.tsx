"use client";

import { useEffect, useState } from "react";
import { Building2, Eye, Lock, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { mutateOrganizationCache, useOrganizationProfile } from "@/hooks/use-organization-profile";
import type { OrganizationProfile, OrgRole } from "@/types/organization";

const editableRoles: Array<OrgRole | null> = ["facility_manager", "organization_admin", "manager", "superadmin"];

function canEditOrganization(role: OrgRole | null) {
  return editableRoles.includes(role);
}

function emptyEditableOrg(): OrganizationProfile {
  return {
    id: "",
    name: "",
    facility_type: "daycare_senior",
    facility_code: "",
    representative_name: "",
    phone: "",
    fax: "",
    email: "",
    address: "",
    logo_url: "",
    capacity: null,
    operating_hours: "",
    website: "",
  };
}

export function SettingsClient() {
  const orgState = useOrganizationProfile();
  const [org, setOrg] = useState<OrganizationProfile>(emptyEditableOrg());
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditable = orgState.status === "ready" && canEditOrganization(orgState.role);
  const readOnly = !isEditable;

  useEffect(() => {
    if (orgState.status === "ready") setOrg({ ...emptyEditableOrg(), ...orgState.org });
  }, [orgState]);

  function update<K extends keyof OrganizationProfile>(key: K, value: OrganizationProfile[K]) {
    setOrg((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!isEditable || !org.id) return;
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    if (!supabase) {
      setSaving(false);
      setMessage("Supabase 연결 정보가 없어 기관 정보를 저장할 수 없습니다.");
      return;
    }

    const { data, error } = await supabase
      .from("organizations")
      .update({
        name: org.name,
        facility_code: org.facility_code,
        representative_name: org.representative_name,
        phone: org.phone,
        fax: org.fax,
        email: org.email,
        address: org.address,
        logo_url: org.logo_url,
        facility_type: org.facility_type,
        capacity: org.capacity,
        operating_hours: org.operating_hours,
        website: org.website,
      })
      .eq("id", org.id)
      .select("*")
      .single<OrganizationProfile>();

    setSaving(false);

    if (error) {
      setMessage(`기관 정보 저장 실패: ${error.message}`);
      return;
    }

    const updated = data ?? org;
    setOrg(updated);
    mutateOrganizationCache(updated, orgState.role);
    setMessage("기관 정보가 저장되었습니다. 화면에 즉시 반영됩니다.");
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge>기관 관리</Badge>
        <h1 className="mt-3 text-2xl font-black text-ink sm:text-3xl">기관 설정</h1>
        <p className="mt-2 text-sm text-muted">
          로그인한 사용자의 소속 기관 프로필을 기준으로 센터명, 로고, 기본 정보를 관리합니다.
        </p>
      </div>

      {orgState.status === "loading" && (
        <div className="rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-muted">
          기관 정보를 불러오는 중입니다.
        </div>
      )}

      {orgState.status === "missing" && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          소속 기관이 설정되지 않았습니다.
        </div>
      )}

      {orgState.status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          기관 정보를 불러오지 못했습니다: {orgState.message}
        </div>
      )}

      {orgState.status === "ready" && (
        <>
          {readOnly ? (
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
              <Eye size={15} />
              조회 전용 — 기관 정보 수정은 시설장 또는 기관 관리자 권한이 필요합니다.
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-800">
              <Lock size={15} />
              관리자 모드 — 저장 즉시 사이드바, 헤더, 문서 생성 컨텍스트에 반영됩니다.
            </div>
          )}

          <section className="max-w-3xl rounded-md border border-line bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                <Building2 size={22} />
              </div>
              <div>
                <h2 className="font-black">기관 정보</h2>
                {message && <p className="mt-1 text-sm font-semibold text-brand-700">{message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-bold">센터명 *</span>
                <Input value={org.name} onChange={(e) => update("name", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">기관기호</span>
                <Input value={org.facility_code ?? ""} onChange={(e) => update("facility_code", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">시설유형</span>
                <select
                  className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
                  value={org.facility_type ?? "daycare_senior"}
                  onChange={(e) => update("facility_type", e.target.value)}
                  disabled={readOnly}
                >
                  <option value="daycare_senior">노인 주야간보호센터</option>
                  <option value="nursing_home">요양원 / 요양시설</option>
                  <option value="welfare_center">노인복지관 / 종합복지관</option>
                  <option value="other">기타</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">대표자</span>
                <Input value={org.representative_name ?? ""} onChange={(e) => update("representative_name", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">전화</span>
                <Input value={org.phone ?? ""} onChange={(e) => update("phone", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">팩스</span>
                <Input value={org.fax ?? ""} onChange={(e) => update("fax", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">이메일</span>
                <Input value={org.email ?? ""} onChange={(e) => update("email", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">정원</span>
                <Input
                  type="number"
                  value={org.capacity ?? ""}
                  onChange={(e) => update("capacity", e.target.value ? Number(e.target.value) : null)}
                  readOnly={readOnly}
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-bold">주소</span>
                <Input value={org.address ?? ""} onChange={(e) => update("address", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">운영시간</span>
                <Input value={org.operating_hours ?? ""} onChange={(e) => update("operating_hours", e.target.value)} readOnly={readOnly} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">홈페이지</span>
                <Input value={org.website ?? ""} onChange={(e) => update("website", e.target.value)} readOnly={readOnly} />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-bold">로고 URL</span>
                <Input value={org.logo_url ?? ""} onChange={(e) => update("logo_url", e.target.value)} readOnly={readOnly} />
                {org.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.logo_url} alt="기관 로고 미리보기" className="mt-2 h-12 w-auto rounded border object-contain" />
                )}
              </label>
            </div>

            {isEditable && (
              <div className="mt-6">
                <Button onClick={save} disabled={saving}>
                  <Save size={17} />
                  {saving ? "저장 중..." : "저장 및 즉시 반영"}
                </Button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
