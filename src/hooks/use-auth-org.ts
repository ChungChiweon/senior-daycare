"use client";

import { useEffect, useState } from "react";
import { BETA_STAFF_ACCOUNTS, type BetaStaffAccount } from "@/lib/data/beta-institution-seed";
import type { ErpRole } from "@/types/erp-task";

// ── useCurrentUser: localStorage 기반 beta 계정 (변경 없음) ─────────────────
export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<BetaStaffAccount>(BETA_STAFF_ACCOUNTS[0]);

  useEffect(() => {
    const savedId = localStorage.getItem("silvercare.activeStaffId");
    if (savedId) {
      const found = BETA_STAFF_ACCOUNTS.find((s) => s.id === savedId);
      if (found) setCurrentUser(found);
    }
  }, []);

  return currentUser;
}

// ── usePermission ─────────────────────────────────────────────────────────────
export function usePermission(requiredRole?: ErpRole) {
  const currentUser = useCurrentUser();
  if (!requiredRole) return true;
  if (currentUser.roleCode === "manager") return true;
  return currentUser.roleCode === requiredRole;
}

// ── useOrganization: DEPRECATED — use useOrganizationProfile() instead ───────
export type CurrentOrg = {
  id: string;
  name: string;
  businessNumber: string;
  address: string;
};

/** @deprecated use useOrganizationProfile() from @/hooks/use-organization-profile */
export function useOrganization(): CurrentOrg {
  const [org] = useState<CurrentOrg>({
    id: "",
    name: "소속 기관이 설정되지 않았습니다.",
    businessNumber: "",
    address: "",
  });

  return org;
}
