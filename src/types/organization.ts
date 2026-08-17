// Organization Profile 타입 정의
// authoritative source: Supabase organizations 테이블

export type OrgRole =
  | "facility_manager"
  | "organization_admin"
  | "manager"
  | "social_worker"
  | "care_worker"
  | "field_staff"
  | "nurse"
  | "clerk"
  | "driver"
  | "superadmin";

export type FacilityType =
  | "daycare_senior"  // 노인 주야간보호센터
  | "nursing_home"    // 요양원 / 요양시설
  | "welfare_center"  // 노인복지관 / 종합복지관
  | "other";

export interface OrganizationProfile {
  id: string;
  name: string;
  business_number?: string | null;
  facility_code?: string | null;
  representative_name?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  address?: string | null;
  logo_url?: string | null;
  facility_type?: FacilityType | string | null;
  capacity?: number | null;
  operating_hours?: string | null;
  website?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

/** 문서 확정 시 저장하는 기관 정보 snapshot (과거 문서 불변 보장) */
export interface OrganizationSnapshot {
  name: string;
  facility_code?: string | null;
  representative_name?: string | null;
  address?: string | null;
  phone?: string | null;
  business_number?: string | null;
}

export function facilityTypeLabel(type?: FacilityType | string | null): string {
  switch (type) {
    case "daycare_senior":  return "노인 주야간보호센터";
    case "nursing_home":    return "요양원 / 요양시설";
    case "welfare_center":  return "노인복지관 / 종합복지관";
    default:                return "장기요양 운영 SaaS";
  }
}
